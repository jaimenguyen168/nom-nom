import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "@/db/schemas/users";
import { z } from "zod";
import { categories } from "@/db/schemas/categories";

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived",
]);

export const blogs = pgTable("blogs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"), // Short description for listing pages
  featuredImage: text("featured_image"), // Main blog image URL
  topic: varchar("topic", { length: 100 }), // dessert, sandwich, breakfast, etc.

  contentBlocks: jsonb("content_blocks"), // JSON array of content blocks

  // Metadata
  status: blogStatusEnum("status").default("draft"),
  publishedAt: timestamp("published_at"),

  // SEO
  // metaDescription: text("meta_description"),
  // metaKeywords: text("meta_keywords"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Author
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Blog tags
export const blogTags = pgTable("blog_tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
});

// Blog comments
export const blogComments = pgTable("blog_comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  parentCommentId: text("parent_comment_id"), // Self-referencing for replies
});

// Comment likes
export const blogCommentLikes = pgTable("blog_comment_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  createdAt: timestamp("created_at").defaultNow(),
  commentId: text("comment_id")
    .notNull()
    .references(() => blogComments.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// User saved blogs
export const userSavedBlogs = pgTable("user_saved_blogs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
});

// Blog likes (separate from saves)
export const blogLikes = pgTable("blog_likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
});

// Blog views tracking (simplified)
export const blogViews = pgTable("blog_views", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id), // null for anonymous views
  ipAddress: varchar("ip_address", { length: 45 }), // For anonymous tracking
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog reviews/ratings
export const blogReviews = pgTable("blog_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Related blogs (manual curation)
export const relatedBlogs = pgTable("related_blogs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  relatedBlogId: text("related_blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogCategories = pgTable(
  "blog_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    blogId: text("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique("blog_category_unique").on(t.blogId, t.categoryId)],
);

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), value: z.string() }),
  z.object({
    type: z.literal("heading"),
    value: z.string(),
    level: z.number().min(1).max(6),
  }),
  z.object({
    type: z.literal("quote"),
    value: z.string(),
    author: z.string().optional(),
  }),
  z.object({
    type: z.literal("image"),
    value: z.string(),
    url: z.string().optional(),
  }),
  z.object({
    type: z.literal("list"),
    value: z.string(),
    items: z.array(z.string()).optional(),
  }),
]);

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  topic: z.string().optional(),
  contentBlocks: z.array(contentBlockSchema),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.object({ name: z.string() })).optional(),
  categoryIds: z.array(z.string()).max(3, "Maximum 3 categories").optional(),
});
