import { index, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    profileImageUrl: text("profile_image_url"),
    bio: text("bio"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("user_email_idx").on(t.email),
    index("user_username_idx").on(t.username),
    index("user_first_name_idx").on(t.firstName),
    index("user_last_name_idx").on(t.lastName),
  ],
);

// followerId follows followingId
export const userFollows = pgTable(
  "user_follows",
  {
    followerId:  text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt:   timestamp("created_at").defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("follows_follower_idx").on(t.followerId),
    index("follows_following_idx").on(t.followingId),
  ],
);
