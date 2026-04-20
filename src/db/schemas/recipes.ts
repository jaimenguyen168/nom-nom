import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { categories } from "@/db/schemas/categories";
import { users } from "@/db/schemas/users";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const recipes = pgTable(
  "recipes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    prepTimeMinutes: integer("prep_time_minutes"),
    cookTimeMinutes: integer("cook_time_minutes"),
    servings: integer("servings").default(1),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B')`,
    ),
  },
  (t) => [
    unique("recipes_user_slug_unique").on(t.userId, t.slug),
    index("recipes_user_idx").on(t.userId),
    index("recipes_public_idx").on(t.isPublic),
    index("recipes_search_idx").using("gin", t.searchVector),
    index("recipes_trgm_idx").using("gin", sql`title gin_trgm_ops`),
  ],
);

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 50 }),
    unit: varchar("unit", { length: 50 }),
    isOptional: boolean("is_optional").default(false),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => [index("recipe_ingredients_recipe_idx").on(t.recipeId)],
);

export const recipeInstructions = pgTable(
  "recipe_instructions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    stepNumber: integer("step_number").notNull(),
    instruction: text("instruction").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => [index("recipe_instructions_recipe_idx").on(t.recipeId)],
);

export const recipeNutrition = pgTable(
  "recipe_nutrition",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    nutrientName: varchar("nutrient_name", { length: 100 }).notNull(),
    amount: integer("amount").notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => [index("recipe_nutrition_recipe_idx").on(t.recipeId)],
);

export const recipeTags = pgTable(
  "recipe_tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => [index("recipe_tags_recipe_idx").on(t.recipeId)],
);

export const recipeComments = pgTable(
  "recipe_comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    reviewId: text("review_id").references(() => recipeReviews.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [
    index("recipe_comments_recipe_idx").on(t.recipeId),
    index("recipe_comments_user_idx").on(t.userId),
    index("recipe_comments_review_idx").on(t.reviewId),
  ],
);

export const recipeReviews = pgTable(
  "recipe_reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    rating: integer("rating").notNull(), // 1-5 stars
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [
    unique("recipe_review_unique").on(t.userId, t.recipeId),
    index("recipe_review_idx").on(t.recipeId),
  ],
);

export const recipeReviewLikes = pgTable(
  "recipe_review_likes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    createdAt: timestamp("created_at").defaultNow(),
    reviewId: text("review_id")
      .notNull()
      .references(() => recipeReviews.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [unique("review_like_unique").on(t.userId, t.reviewId)],
);

export const recipeCommentLikes = pgTable(
  "recipe_comment_likes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    createdAt: timestamp("created_at").defaultNow(),
    commentId: text("comment_id")
      .notNull()
      .references(() => recipeComments.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [unique("recipe_comment_like_unique").on(t.userId, t.commentId)],
);

export const userSavedRecipes = pgTable(
  "user_saved_recipes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    createdAt: timestamp("created_at").defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => [
    unique("user_saved_recipe_unique").on(t.userId, t.recipeId),
    index("user_saved_recipe_idx").on(t.userId, t.recipeId),
  ],
);

export const recipeCategories = pgTable(
  "recipe_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique("recipe_category_unique").on(t.recipeId, t.categoryId)],
);

// -------- Schema for creating a new recipe --------

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  servings: z.string().optional(),
  cookingTime: z.object({
    hours: z.string().optional(),
    minutes: z.string().optional(),
  }),
  prepTime: z.object({
    hours: z.string().optional(),
    minutes: z.string().optional(),
  }),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Ingredient name is required"),
      amount: z.string().optional(),
      unit: z.string().optional(),
      isOptional: z.boolean(),
    }),
  ),
  instructions: z.array(
    z.object({
      stepNumber: z.number(),
      instruction: z.string().min(1, "Instruction is required"),
    }),
  ),
  nutrition: z.array(
    z.object({
      nutrientName: z.string().min(1, "Nutrient name is required"),
      amount: z.number().min(0),
      unit: z.string().min(1, "Unit is required"),
    }),
  ),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
  categoryIds: z.array(z.string()).max(3, "Maximum 3 categories").optional(),
});
