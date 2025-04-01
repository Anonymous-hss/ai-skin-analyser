// lib/db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  hasUsedService: boolean("has_used_service").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Analysis history table
export const analysisHistory = pgTable("analysis_history", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  imageUrl: text("image_url").notNull(),
  analysisData: text("analysis_data").notNull(), // JSON stringified
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define types based on schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AnalysisHistory = typeof analysisHistory.$inferSelect;
export type NewAnalysisHistory = typeof analysisHistory.$inferInsert;
