import { eq, and, gte, lte, between } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, dailyEditions, DailyEdition, InsertDailyEdition, qualifiedLeads, InsertQualifiedLead, QualifiedLead, clients, InsertClient, Client, transactions, InsertTransaction, Transaction } from "../drizzle/schema";
import { desc, sql, asc } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Lead Queries ───────────────────────────────────────────

export async function createLead(lead: InsertLead): Promise<Lead> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const [result] = await db.insert(leads).values(lead).$returningId();
  const [created] = await db.select().from(leads).where(eq(leads.id, result.id)).limit(1);
  return created;
}

export async function getLeadByEmail(email: string): Promise<Lead | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

// ─── Daily Edition Queries ──────────────────────────────────────────

export async function getDailyEdition(dateStr: string): Promise<DailyEdition | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dailyEditions).where(eq(dailyEditions.editionDate, dateStr)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLatestEdition(): Promise<DailyEdition | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dailyEditions).orderBy(desc(dailyEditions.editionDate)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEditionCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: sql<number>`count(*)` }).from(dailyEditions);
  return result[0]?.count ?? 0;
}

// ─── Qualified Lead Queries ──────────────────────────────────────────

export async function createQualifiedLead(lead: InsertQualifiedLead): Promise<QualifiedLead> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(qualifiedLeads).values(lead).$returningId();
  const [created] = await db.select().from(qualifiedLeads).where(eq(qualifiedLeads.id, result.id)).limit(1);
  return created;
}

export async function getQualifiedLeadByEmail(email: string): Promise<QualifiedLead | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(qualifiedLeads).where(eq(qualifiedLeads.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllQualifiedLeads(): Promise<QualifiedLead[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(qualifiedLeads).orderBy(desc(qualifiedLeads.createdAt));
}

// ─── Daily Edition Queries ──────────────────────────────────────────

export async function insertDailyEdition(edition: InsertDailyEdition): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyEditions).values(edition).onDuplicateKeyUpdate({
    set: {
      headline: edition.headline,
      editorialP1: edition.editorialP1,
      editorialP2: edition.editorialP2,
      editorialP3: edition.editorialP3,
      imageCaption: edition.imageCaption,
      statsTitle: edition.statsTitle,
      stat1Number: edition.stat1Number,
      stat1Suffix: edition.stat1Suffix,
      stat1Label: edition.stat1Label,
      stat1Desc: edition.stat1Desc,
      stat1Source: edition.stat1Source,
      stat2Number: edition.stat2Number,
      stat2Suffix: edition.stat2Suffix,
      stat2Label: edition.stat2Label,
      stat2Desc: edition.stat2Desc,
      stat2Source: edition.stat2Source,
      stat3Number: edition.stat3Number,
      stat3Suffix: edition.stat3Suffix,
      stat3Label: edition.stat3Label,
      stat3Desc: edition.stat3Desc,
      stat3Source: edition.stat3Source,
      quote: edition.quote,
      ctaTitle: edition.ctaTitle,
      ctaText: edition.ctaText,
    },
  });
}

// ─── Client Queries ──────────────────────────────────────────

export async function createClient(client: InsertClient): Promise<Client> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(clients).values(client).$returningId();
  const [created] = await db.select().from(clients).where(eq(clients.id, result.id)).limit(1);
  return created;
}

export async function updateClient(id: number, data: Partial<InsertClient>): Promise<Client> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clients).set(data).where(eq(clients.id, id));
  const [updated] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return updated;
}

export async function deleteClient(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Also delete related transactions
  await db.delete(transactions).where(eq(transactions.clientId, id));
  await db.delete(clients).where(eq(clients.id, id));
}

export async function getClientById(id: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllClients(): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

// ─── Transaction Queries ──────────────────────────────────────────

export async function createTransaction(tx: InsertTransaction): Promise<Transaction> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(transactions).values(tx).$returningId();
  const [created] = await db.select().from(transactions).where(eq(transactions.id, result.id)).limit(1);
  return created;
}

export async function updateTransaction(id: number, data: Partial<InsertTransaction>): Promise<Transaction> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(transactions).set(data).where(eq(transactions.id, id));
  const [updated] = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  return updated;
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(transactions).where(eq(transactions.id, id));
}

export async function getTransactionsByClient(clientId: number): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(transactions).where(eq(transactions.clientId, clientId)).orderBy(desc(transactions.date));
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(transactions).orderBy(desc(transactions.date));
}

export async function getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(transactions)
    .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .orderBy(desc(transactions.date));
}

// ─── Admin Dashboard Queries ──────────────────────────────────────────

export async function getLeadsStats() {
  const db = await getDb();
  if (!db) return { totalLeads: 0, totalQualified: 0, todayLeads: 0, todayQualified: 0, leadsBySector: [], leadsByDay: [] };

  const totalLeads = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const totalQualified = await db.select({ count: sql<number>`count(*)` }).from(qualifiedLeads);

  // Today's leads (Rome timezone)
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLeads = await db.select({ count: sql<number>`count(*)` }).from(leads)
    .where(sql`DATE(${leads.createdAt}) = ${todayStr}`);
  const todayQualified = await db.select({ count: sql<number>`count(*)` }).from(qualifiedLeads)
    .where(sql`DATE(${qualifiedLeads.createdAt}) = ${todayStr}`);

  // Leads by sector
  const leadsBySector = await db.select({
    sector: leads.sector,
    count: sql<number>`count(*)`,
  }).from(leads).groupBy(leads.sector).orderBy(sql`count(*) DESC`);

  // Leads by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

  const leadsByDay = await db.select({
    date: sql<string>`DATE(${leads.createdAt})`,
    count: sql<number>`count(*)`,
  }).from(leads)
    .where(sql`DATE(${leads.createdAt}) >= ${thirtyDaysAgoStr}`)
    .groupBy(sql`DATE(${leads.createdAt})`)
    .orderBy(sql`DATE(${leads.createdAt}) ASC`);

  return {
    totalLeads: totalLeads[0]?.count ?? 0,
    totalQualified: totalQualified[0]?.count ?? 0,
    todayLeads: todayLeads[0]?.count ?? 0,
    todayQualified: todayQualified[0]?.count ?? 0,
    leadsBySector,
    leadsByDay,
  };
}

export async function getFinancialSummary() {
  const db = await getDb();
  if (!db) return { totalEntradas: 0, totalSaidas: 0, saldo: 0, monthlyFlow: [] };

  const totalEntradas = await db.select({ sum: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(transactions).where(eq(transactions.type, "entrada"));
  const totalSaidas = await db.select({ sum: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(transactions).where(eq(transactions.type, "saida"));

  // Monthly flow (last 12 months)
  const monthlyFlow = await db.select({
    month: sql<string>`DATE_FORMAT(STR_TO_DATE(date, '%Y-%m-%d'), '%Y-%m')`,
    entradas: sql<number>`COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END), 0)`,
    saidas: sql<number>`COALESCE(SUM(CASE WHEN type = 'saida' THEN amount ELSE 0 END), 0)`,
  }).from(transactions)
    .groupBy(sql`DATE_FORMAT(STR_TO_DATE(date, '%Y-%m-%d'), '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(STR_TO_DATE(date, '%Y-%m-%d'), '%Y-%m') ASC`)
    .limit(12);

  const entradas = totalEntradas[0]?.sum ?? 0;
  const saidas = totalSaidas[0]?.sum ?? 0;

  return {
    totalEntradas: entradas,
    totalSaidas: saidas,
    saldo: entradas - saidas,
    monthlyFlow,
  };
}

export async function getBalanceByClient() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    clientId: transactions.clientId,
    entradas: sql<number>`COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END), 0)`,
    saidas: sql<number>`COALESCE(SUM(CASE WHEN type = 'saida' THEN amount ELSE 0 END), 0)`,
    saldo: sql<number>`COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN type = 'saida' THEN amount ELSE 0 END), 0)`,
  }).from(transactions)
    .groupBy(transactions.clientId);

  return result;
}
