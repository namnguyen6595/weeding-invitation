import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rsvps = sqliteTable("rsvps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestName: text("guest_name").notNull(),
  attendance: text("attendance", { enum: ["yes", "no"] }).notNull(),
  guestCount: integer("guest_count").notNull().default(1),
  family: text("family", { enum: ["groom", "bride"] }),
  message: text("message").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
