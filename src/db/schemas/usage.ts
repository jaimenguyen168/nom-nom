import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * One row per user per billing month.
 *
 * Instead of updating a single row in place, a new row is inserted at the
 * start of each calendar month. This lets users (and admins) see their full
 * usage history broken down by period.
 *
 * The "current" period is always the row where
 *   periodStart = startOfMonth(now)
 *
 * The unique constraint on (user_id, period_start) prevents duplicates if
 * getOrCreateUsage is called concurrently.
 */
export const userUsage = pgTable(
  "user_usage",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** First day of the calendar month this record covers. */
    periodStart: timestamp("period_start").notNull(),
    aiRecipesUsed: integer("ai_recipes_used").default(0).notNull(),
    aiBlogsUsed: integer("ai_blogs_used").default(0).notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("usage_user_id_idx").on(t.userId),
    unique("usage_user_period_unique").on(t.userId, t.periodStart),
  ],
);

export type UserUsage = typeof userUsage.$inferSelect;
