import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, dailyEditions, DailyEdition, InsertDailyEdition, qualifiedLeads, InsertQualifiedLead, QualifiedLead } from "../drizzle/schema";
import { desc, sql } from "drizzle-orm";
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
