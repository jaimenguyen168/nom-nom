import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import {
  cookbooks,
  cookbookRecipes,
  cookbookCategories,
  cookbookTags,
  createCookbookSchema,
} from "@/db/schemas/cookbooks";
import { users } from "@/db/schemas/users";
import { recipes } from "@/db/schemas/recipes";
import { cookbookReviews } from "@/db/schemas/cookbooks";
import { avg, count, desc, eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

export const cookbooksRouter = createTRPCRouter({
  create: authProcedure
    .input(createCookbookSchema)
    .mutation(async ({ ctx, input }) => {
      const [cookbook] = await nomnomDb
        .insert(cookbooks)
        .values({
          title: input.title,
          slug: slugify(input.title),
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          bannerImageUrl: input.bannerImageUrl,
          authorId: ctx.userId,
          cuisine: input.cuisine,
          difficulty: input.difficulty,
          servingsRange: input.servingsRange,
          language: input.language,
          edition: input.edition,
          isFree: input.isFree,
          price: input.price?.toString(),
          currency: input.currency,
          status: input.status,
          publishedAt: input.status === "published" ? new Date() : null,
        })
        .returning();

      await Promise.all([
        input.recipeIds &&
          input.recipeIds.length > 0 &&
          nomnomDb.insert(cookbookRecipes).values(
            input.recipeIds.map((recipeId, index) => ({
              cookbookId: cookbook.id,
              recipeId,
              orderIndex: index,
            })),
          ),

        input.categoryIds &&
          input.categoryIds.length > 0 &&
          nomnomDb.insert(cookbookCategories).values(
            input.categoryIds.map((categoryId) => ({
              cookbookId: cookbook.id,
              categoryId,
            })),
          ),

        input.tags &&
          input.tags.length > 0 &&
          nomnomDb.insert(cookbookTags).values(
            input.tags.map((name) => ({
              cookbookId: cookbook.id,
              name: name.toLowerCase().trim(),
            })),
          ),
      ]);

      const user = await nomnomDb
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { slug: cookbook.slug, username: user.username };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;

      const data = await nomnomDb
        .select({
          id: cookbooks.id,
          title: cookbooks.title,
          slug: cookbooks.slug,
          description: cookbooks.description,
          coverImageUrl: cookbooks.coverImageUrl,
          cuisine: cookbooks.cuisine,
          difficulty: cookbooks.difficulty,
          isFree: cookbooks.isFree,
          price: cookbooks.price,
          currency: cookbooks.currency,
          status: cookbooks.status,
          publishedAt: cookbooks.publishedAt,
          createdAt: cookbooks.createdAt,
          authorId: cookbooks.authorId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalRecipes: count(cookbookRecipes.id).as("totalRecipes"),
          avgRating: avg(cookbookReviews.rating).as("avgRating"),
          totalReviews: count(cookbookReviews.id).as("totalReviews"),
        })
        .from(cookbooks)
        .leftJoin(users, eq(cookbooks.authorId, users.id))
        .leftJoin(cookbookRecipes, eq(cookbookRecipes.cookbookId, cookbooks.id))
        .leftJoin(cookbookReviews, eq(cookbookReviews.cookbookId, cookbooks.id))
        .where(eq(cookbooks.status, "published"))
        .groupBy(cookbooks.id, users.username, users.profileImageUrl)
        .orderBy(desc(cookbooks.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(cookbooks)
        .where(eq(cookbooks.status, "published"));

      return {
        items: data.map((c) => ({
          ...c,
          avgRating: c.avgRating ? parseFloat(c.avgRating) : 0,
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const cookbook = await nomnomDb
        .select({
          id: cookbooks.id,
          title: cookbooks.title,
          slug: cookbooks.slug,
          description: cookbooks.description,
          coverImageUrl: cookbooks.coverImageUrl,
          bannerImageUrl: cookbooks.bannerImageUrl,
          cuisine: cookbooks.cuisine,
          difficulty: cookbooks.difficulty,
          servingsRange: cookbooks.servingsRange,
          language: cookbooks.language,
          edition: cookbooks.edition,
          isFree: cookbooks.isFree,
          price: cookbooks.price,
          currency: cookbooks.currency,
          status: cookbooks.status,
          publishedAt: cookbooks.publishedAt,
          createdAt: cookbooks.createdAt,
          authorId: cookbooks.authorId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(cookbooks)
        .leftJoin(users, eq(cookbooks.authorId, users.id))
        .where(eq(cookbooks.slug, input.slug))
        .then((rows) => rows[0]);

      if (!cookbook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cookbook not found",
        });
      }

      const isOwner = ctx.userId === cookbook.authorId;

      if (cookbook.status !== "published" && !isOwner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cookbook not found",
        });
      }

      const [recipesData, tags, stats] = await Promise.all([
        nomnomDb
          .select({
            id: recipes.id,
            title: recipes.title,
            slug: recipes.slug,
            imageUrl: recipes.imageUrl,
            orderIndex: cookbookRecipes.orderIndex,
            chapterTitle: cookbookRecipes.chapterTitle,
          })
          .from(cookbookRecipes)
          .innerJoin(recipes, eq(recipes.id, cookbookRecipes.recipeId))
          .where(eq(cookbookRecipes.cookbookId, cookbook.id))
          .orderBy(cookbookRecipes.orderIndex),

        nomnomDb
          .select({ name: cookbookTags.name })
          .from(cookbookTags)
          .where(eq(cookbookTags.cookbookId, cookbook.id)),

        nomnomDb
          .select({
            avgRating: avg(cookbookReviews.rating),
            totalReviews: count(cookbookReviews.id),
          })
          .from(cookbookReviews)
          .where(eq(cookbookReviews.cookbookId, cookbook.id))
          .then((rows) => rows[0]),
      ]);

      return {
        ...cookbook,
        recipes: recipesData,
        tags: tags.map((t) => t.name),
        avgRating: stats.avgRating ? parseFloat(stats.avgRating) : 0,
        totalReviews: stats.totalReviews,
      };
    }),
});
