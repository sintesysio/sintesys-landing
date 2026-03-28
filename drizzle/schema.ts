import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads captured from the landing page newsletter form.
 * Stores name, email, phone, business sector and source.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  sector: varchar("sector", { length: 100 }).notNull(),
  source: varchar("source", { length: 100 }).default("landing_page").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Daily editorial editions for the landing page.
 * Each row represents one day's content — headline, editorial, quote, stats.
 * The `editionDate` field (YYYY-MM-DD) determines which content to show.
 */
export const dailyEditions = mysqlTable("daily_editions", {
  id: int("id").autoincrement().primaryKey(),
  editionDate: varchar("editionDate", { length: 10 }).notNull().unique(), // YYYY-MM-DD
  editionNumber: int("editionNumber").notNull(),
  headline: varchar("headline", { length: 500 }).notNull(),
  editorialP1: text("editorialP1").notNull(), // First paragraph (drop cap)
  editorialP2: text("editorialP2").notNull(), // Second paragraph
  editorialP3: text("editorialP3").notNull(), // Third paragraph
  imageCaption: varchar("imageCaption", { length: 500 }).notNull(),
  statsTitle: varchar("statsTitle", { length: 300 }).notNull(),
  stat1Number: int("stat1Number").notNull(),
  stat1Suffix: varchar("stat1Suffix", { length: 10 }).notNull(),
  stat1Label: varchar("stat1Label", { length: 100 }).notNull(),
  stat1Desc: varchar("stat1Desc", { length: 500 }).notNull(),
  stat1Source: varchar("stat1Source", { length: 200 }).notNull(),
  stat2Number: int("stat2Number").notNull(),
  stat2Suffix: varchar("stat2Suffix", { length: 10 }).notNull(),
  stat2Label: varchar("stat2Label", { length: 100 }).notNull(),
  stat2Desc: varchar("stat2Desc", { length: 500 }).notNull(),
  stat2Source: varchar("stat2Source", { length: 200 }).notNull(),
  stat3Number: int("stat3Number").notNull(),
  stat3Suffix: varchar("stat3Suffix", { length: 10 }).notNull(),
  stat3Label: varchar("stat3Label", { length: 100 }).notNull(),
  stat3Desc: varchar("stat3Desc", { length: 500 }).notNull(),
  stat3Source: varchar("stat3Source", { length: 200 }).notNull(),
  quote: text("quote").notNull(),
  ctaTitle: varchar("ctaTitle", { length: 300 }).notNull(),
  ctaText: text("ctaText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyEdition = typeof dailyEditions.$inferSelect;
export type InsertDailyEdition = typeof dailyEditions.$inferInsert;