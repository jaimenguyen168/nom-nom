import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import {
  blogCategories,
  blogs,
  blogTags,
  createBlogSchema,
  userSavedBlogs,
} from "@/db/schemas/blogs";
import { users } from "@/db/schemas/users";
import { nomnomDb } from "@/db";
import { and, asc, count, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { recipeCategories, recipes, recipeTags } from "@/db/schemas/recipes";

export const blogsRouter = createTRPCRouter({
  create: authProcedure
    .input(createBlogSchema)
    .mutation(async ({ ctx, input }) => {
      const [blog] = await nomnomDb
        .insert(blogs)
        .values({
          title: input.title,
          slug: input.slug || slugify(input.title),
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          topic: input.topic,
          contentBlocks: input.contentBlocks,
          status: input.status,
          authorId: ctx.userId,
          publishedAt: input.status === "published" ? new Date() : null,
        })
        .returning();

      if (input.tags && input.tags.length > 0) {
        await nomnomDb.insert(blogTags).values(
          input.tags.map((tag) => ({
            name: tag.name,
            blogId: blog.id,
          })),
        );
      }

      if (input.categoryIds && input.categoryIds.length > 0) {
        await nomnomDb.insert(blogCategories).values(
          input.categoryIds.map((categoryId) => ({
            categoryId,
            blogId: blog.id,
          })),
        );
      }

      const user = await nomnomDb
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { username: user.username, blogSlug: blog.slug };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await nomnomDb
        .select()
        .from(blogs)
        .innerJoin(users, eq(blogs.authorId, users.id))
        .where(eq(blogs.slug, input.slug))
        .then((rows) => rows[0]);

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      const isOwner = ctx.userId === result.blogs.authorId;

      if (result.blogs.status !== "published" && !isOwner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      const tags = await nomnomDb
        .select()
        .from(blogTags)
        .where(eq(blogTags.blogId, result.blogs.id));

      return { ...result, tags };
    }),

  getByUsernameAndSlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await nomnomDb
        .select()
        .from(blogs)
        .innerJoin(users, eq(blogs.authorId, users.id))
        .where(
          and(eq(users.username, input.username), eq(blogs.slug, input.slug)),
        )
        .then((rows) => rows[0]);

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      const isOwner = ctx.userId === result.blogs.authorId;

      if (result.blogs.status !== "published" && !isOwner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      const blogId = result.blogs.id;

      const tags = await nomnomDb
        .select()
        .from(blogTags)
        .where(eq(blogTags.blogId, blogId));

      return { ...result, tags };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        sortBy: z.enum(["new", "popular", "a_z"]).default("new"),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, sortBy } = input;

      const orderBy =
        sortBy === "a_z"
          ? asc(blogs.title)
          : sortBy === "popular"
            ? desc(count(userSavedBlogs.id))
            : desc(blogs.createdAt);

      const data = await nomnomDb
        .select({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          excerpt: blogs.excerpt,
          featuredImage: blogs.featuredImage,
          topic: blogs.topic,
          status: blogs.status,
          createdAt: blogs.createdAt,
          authorId: blogs.authorId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .leftJoin(userSavedBlogs, eq(userSavedBlogs.blogId, blogs.id))
        .where(eq(blogs.status, "published"))
        .groupBy(blogs.id, users.username, users.profileImageUrl)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(blogs)
        .where(eq(blogs.status, "published"));

      return {
        items: data,
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),

  toggleSave: authProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(userSavedBlogs)
        .where(
          and(
            eq(userSavedBlogs.userId, ctx.userId),
            eq(userSavedBlogs.blogId, input.blogId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(userSavedBlogs)
          .where(
            and(
              eq(userSavedBlogs.userId, ctx.userId),
              eq(userSavedBlogs.blogId, input.blogId),
            ),
          );
        return { isSaved: false };
      }

      await nomnomDb
        .insert(userSavedBlogs)
        .values({ userId: ctx.userId, blogId: input.blogId });

      return { isSaved: true };
    }),

  isSaved: authProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(userSavedBlogs)
        .where(
          and(
            eq(userSavedBlogs.userId, ctx.userId),
            eq(userSavedBlogs.blogId, input.blogId),
          ),
        )
        .then((rows) => rows[0]);

      return { isSaved: !!existing };
    }),

  savesCount: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const total = await nomnomDb
        .select()
        .from(userSavedBlogs)
        .where(eq(userSavedBlogs.blogId, input.blogId))
        .then((rows) => rows.length);

      return { savesCount: total };
    }),

  getRelatedRecipeId: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const blogCategoryIds = await nomnomDb
        .select({ categoryId: blogCategories.categoryId })
        .from(blogCategories)
        .where(eq(blogCategories.blogId, input.blogId));

      if (blogCategoryIds.length > 0) {
        const ids = blogCategoryIds.map((c) => c.categoryId);

        const match = await nomnomDb
          .selectDistinct({ recipeId: recipeCategories.recipeId })
          .from(recipeCategories)
          .innerJoin(recipes, eq(recipes.id, recipeCategories.recipeId))
          .where(
            and(
              eq(recipes.isPublic, true),
              inArray(recipeCategories.categoryId, ids),
            ),
          )
          .limit(1)
          .then((rows) => rows[0]);

        if (match) return { recipeId: match.recipeId };
      }

      const blog = await nomnomDb
        .select({ topic: blogs.topic })
        .from(blogs)
        .where(eq(blogs.id, input.blogId))
        .then((rows) => rows[0]);

      if (blog?.topic) {
        const tagMatch = await nomnomDb
          .select({ recipeId: recipeTags.recipeId })
          .from(recipeTags)
          .innerJoin(recipes, eq(recipes.id, recipeTags.recipeId))
          .where(
            and(
              eq(recipes.isPublic, true),
              sql`LOWER(${recipeTags.name}) = LOWER(${blog.topic})`,
            ),
          )
          .limit(1)
          .then((rows) => rows[0]);

        if (tagMatch) return { recipeId: tagMatch.recipeId };
      }

      const random = await nomnomDb
        .select({ id: recipes.id })
        .from(recipes)
        .where(eq(recipes.isPublic, true))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .then((rows) => rows[0]);

      return random ? { recipeId: random.id } : null;
    }),

  getBySameCategories: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const currentCategories = await nomnomDb
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.blogId, input.blogId));

      const categoryIds = currentCategories.map((c) => c.categoryId);

      const baseQuery =
        categoryIds.length > 0
          ? and(
              eq(blogs.status, "published"),
              ne(blogs.id, input.blogId),
              inArray(blogCategories.categoryId, categoryIds),
            )
          : and(eq(blogs.status, "published"), ne(blogs.id, input.blogId));

      return nomnomDb
        .selectDistinct({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          featuredImage: blogs.featuredImage,
          authorId: blogs.authorId,
          username: users.username,
          createdAt: blogs.createdAt,
        })
        .from(blogs)
        .leftJoin(blogCategories, eq(blogCategories.blogId, blogs.id))
        .leftJoin(users, eq(blogs.authorId, users.id))
        .where(baseQuery)
        .groupBy(blogs.id, users.username)
        .limit(6);
    }),

  update: authProcedure
    .input(createBlogSchema.extend({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(blogs)
        .where(and(eq(blogs.id, input.blogId), eq(blogs.authorId, ctx.userId)))
        .then((rows) => rows[0]);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      await nomnomDb
        .update(blogs)
        .set({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          topic: input.topic,
          contentBlocks: input.contentBlocks,
          status: input.status,
          publishedAt:
            input.status === "published" && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, input.blogId));

      await Promise.all([
        nomnomDb.delete(blogTags).where(eq(blogTags.blogId, input.blogId)),
        nomnomDb
          .delete(blogCategories)
          .where(eq(blogCategories.blogId, input.blogId)),
      ]);

      await Promise.all([
        input.tags &&
          input.tags.length > 0 &&
          nomnomDb.insert(blogTags).values(
            input.tags.map((tag) => ({
              name: tag.name,
              blogId: input.blogId,
            })),
          ),
        input.categoryIds &&
          input.categoryIds.length > 0 &&
          nomnomDb.insert(blogCategories).values(
            input.categoryIds.map((categoryId) => ({
              categoryId,
              blogId: input.blogId,
            })),
          ),
      ]);

      const user = await nomnomDb
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { username: user.username, blogSlug: existing.slug };
    }),

  getManyByUser: authProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        status: z
          .enum(["all", "published", "draft", "archived"])
          .default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status } = input;

      const whereClause =
        status === "all"
          ? eq(blogs.authorId, ctx.userId)
          : and(eq(blogs.authorId, ctx.userId), eq(blogs.status, status));

      const data = await nomnomDb
        .select({
          id: blogs.id,
          title: blogs.title,
          slug: blogs.slug,
          excerpt: blogs.excerpt,
          featuredImage: blogs.featuredImage,
          topic: blogs.topic,
          status: blogs.status,
          createdAt: blogs.createdAt,
          authorId: blogs.authorId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(blogs)
        .leftJoin(users, eq(blogs.authorId, users.id))
        .where(whereClause)
        .orderBy(desc(blogs.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(blogs)
        .where(whereClause);

      return {
        items: data,
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),
});
