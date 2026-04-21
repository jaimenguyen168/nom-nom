import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "@/db/schemas/users";
import { recipes } from "@/db/schemas/recipes";
import { categories } from "@/db/schemas/categories";
import { z } from "zod";

export const cookbookStatusEnum = pgEnum("cookbook_status", [
  "draft",
  "published",
  "archived",
]);

export const cookbookDifficultyEnum = pgEnum("cookbook_difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);

// ── Cookbook ──────────────────────────────────────────────────────────────────

export const cookbooks = pgTable(
  "cookbooks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    bannerImageUrl: text("banner_image_url"),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cuisine: varchar("cuisine", { length: 100 }),
    difficulty: cookbookDifficultyEnum("difficulty"),
    servingsRange: varchar("servings_range", { length: 50 }),
    language: varchar("language", { length: 50 }).default("English"),
    edition: varchar("edition", { length: 50 }),
    publishedAt: timestamp("published_at"),
    isFree: boolean("is_free").default(true),
    price: decimal("price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: cookbookStatusEnum("status").default("draft"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    unique("cookbook_author_slug_unique").on(t.authorId, t.slug),
    index("cookbooks_author_idx").on(t.authorId),
    index("cookbooks_status_idx").on(t.status),
    index("cookbooks_is_free_idx").on(t.isFree),
  ],
);

// ── Cookbook Recipes ──────────────────────────────────────────────────────────

export const cookbookRecipes = pgTable(
  "cookbook_recipes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull().default(0),
    chapterTitle: varchar("chapter_title", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("cookbook_recipe_unique").on(t.cookbookId, t.recipeId),
    index("cookbook_recipes_cookbook_idx").on(t.cookbookId),
    index("cookbook_recipes_recipe_idx").on(t.recipeId),
  ],
);

// ── Cookbook Categories ───────────────────────────────────────────────────────

export const cookbookCategories = pgTable(
  "cookbook_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("cookbook_category_unique").on(t.cookbookId, t.categoryId),
    index("cookbook_categories_cookbook_idx").on(t.cookbookId),
  ],
);

// ── Cookbook Tags ─────────────────────────────────────────────────────────────

export const cookbookTags = pgTable(
  "cookbook_tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 100 }).notNull(),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("cookbook_tags_cookbook_idx").on(t.cookbookId)],
);

// ── Cookbook Purchases ────────────────────────────────────────────────────────

export const cookbookPurchases = pgTable(
  "cookbook_purchases",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pricePaid: decimal("price_paid", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("cookbook_purchase_unique").on(t.cookbookId, t.userId),
    index("cookbook_purchases_user_idx").on(t.userId),
    index("cookbook_purchases_cookbook_idx").on(t.cookbookId),
  ],
);

// ── Cookbook Saved ────────────────────────────────────────────────────────────

export const userSavedCookbooks = pgTable(
  "user_saved_cookbooks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("user_saved_cookbook_unique").on(t.userId, t.cookbookId),
    index("user_saved_cookbooks_user_idx").on(t.userId),
  ],
);

// ── Cookbook Reviews ──────────────────────────────────────────────────────────

export const cookbookReviews = pgTable(
  "cookbook_reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    cookbookId: text("cookbook_id")
      .notNull()
      .references(() => cookbooks.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    unique("cookbook_review_unique").on(t.userId, t.cookbookId),
    index("cookbook_reviews_cookbook_idx").on(t.cookbookId),
  ],
);

// ── Zod Schema ────────────────────────────────────────────────────────────────

export const createCookbookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  servingsRange: z.string().optional(),
  language: z.string().optional(),
  edition: z.string().optional(),
  isFree: z.boolean(),
  price: z.number().min(0).optional(),
  currency: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  recipeIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).max(3).optional(),
  tags: z.array(z.string()).optional(),
});
