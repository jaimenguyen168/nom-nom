import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import { stripe } from "@/lib/stripe";
import {
  cookbooks,
  cookbookRecipes,
  cookbookCategories,
  cookbookTags,
  cookbookPurchases,
  createCookbookSchema,
  cookbookReviews,
  userSavedCookbooks,
} from "@/db/schemas/cookbooks";
import { users } from "@/db/schemas/users";
import { recipes } from "@/db/schemas/recipes";
import { and, avg, count, desc, eq } from "drizzle-orm";
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
          price:
            input.price != null && input.price > 0
              ? input.price.toString()
              : null,
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

      // Check purchase access for paid cookbooks
      const hasPurchased = cookbook.isFree
        ? true
        : ctx.userId
          ? await nomnomDb
              .select()
              .from(cookbookPurchases)
              .where(
                and(
                  eq(cookbookPurchases.cookbookId, cookbook.id),
                  eq(cookbookPurchases.userId, ctx.userId),
                ),
              )
              .then((rows) => rows.length > 0)
          : false;

      // Check if user has saved this cookbook (grants access to free cookbooks)
      const isSaved = ctx.userId
        ? await nomnomDb
            .select()
            .from(userSavedCookbooks)
            .where(
              and(
                eq(userSavedCookbooks.cookbookId, cookbook.id),
                eq(userSavedCookbooks.userId, ctx.userId),
              ),
            )
            .then((rows) => rows.length > 0)
        : false;

      const canAccess = isOwner || hasPurchased || (cookbook.isFree && isSaved);

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
        recipes: canAccess
          ? recipesData.map((r) => ({ ...r, isLocked: false }))
          : recipesData.map((r) => ({
              id: r.id,
              title: r.title,
              imageUrl: r.imageUrl,
              orderIndex: r.orderIndex,
              chapterTitle: r.chapterTitle,
              slug: null,
              isLocked: true,
            })),
        isLocked: !canAccess,
        hasPurchased,
        isSaved,
        tags: tags.map((t) => t.name),
        avgRating: stats.avgRating ? parseFloat(stats.avgRating) : 0,
        totalReviews: stats.totalReviews,
      };
    }),

  getSavedByUser: authProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
      }),
    )
    .query(async ({ ctx, input }) => {
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
          createdAt: cookbooks.createdAt,
          authorId: cookbooks.authorId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalRecipes: count(cookbookRecipes.id).as("totalRecipes"),
          avgRating: avg(cookbookReviews.rating).as("avgRating"),
          totalReviews: count(cookbookReviews.id).as("totalReviews"),
        })
        .from(userSavedCookbooks)
        .innerJoin(cookbooks, eq(cookbooks.id, userSavedCookbooks.cookbookId))
        .leftJoin(users, eq(cookbooks.authorId, users.id))
        .leftJoin(cookbookRecipes, eq(cookbookRecipes.cookbookId, cookbooks.id))
        .leftJoin(cookbookReviews, eq(cookbookReviews.cookbookId, cookbooks.id))
        .where(
          and(
            eq(userSavedCookbooks.userId, ctx.userId),
            eq(cookbooks.status, "published"),
          ),
        )
        .groupBy(cookbooks.id, users.username, users.profileImageUrl)
        .orderBy(desc(cookbooks.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(userSavedCookbooks)
        .innerJoin(cookbooks, eq(cookbooks.id, userSavedCookbooks.cookbookId))
        .where(
          and(
            eq(userSavedCookbooks.userId, ctx.userId),
            eq(cookbooks.status, "published"),
          ),
        );

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

  getManyByUser: authProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        status: z
          .enum(["all", "draft", "published", "archived"])
          .default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status } = input;

      const whereClause =
        status === "all"
          ? eq(cookbooks.authorId, ctx.userId)
          : and(
              eq(cookbooks.authorId, ctx.userId),
              eq(cookbooks.status, status),
            );

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
        .where(whereClause)
        .groupBy(cookbooks.id, users.username, users.profileImageUrl)
        .orderBy(desc(cookbooks.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(cookbooks)
        .where(whereClause);

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

  toggleSave: authProcedure
    .input(z.object({ cookbookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(userSavedCookbooks)
        .where(
          and(
            eq(userSavedCookbooks.userId, ctx.userId),
            eq(userSavedCookbooks.cookbookId, input.cookbookId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(userSavedCookbooks)
          .where(eq(userSavedCookbooks.id, existing.id));
        return { isSaved: false };
      }

      await nomnomDb
        .insert(userSavedCookbooks)
        .values({ userId: ctx.userId, cookbookId: input.cookbookId });

      return { isSaved: true };
    }),

  getByUsernameAndSlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await nomnomDb
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, input.username))
        .then((rows) => rows[0]);

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

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
          authorId: cookbooks.authorId,
          createdAt: cookbooks.createdAt,
          updatedAt: cookbooks.updatedAt,
        })
        .from(cookbooks)
        .where(
          and(eq(cookbooks.authorId, user.id), eq(cookbooks.slug, input.slug)),
        )
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

      const [tags, cookbookRecipesData, categories] = await Promise.all([
        nomnomDb
          .select({ name: cookbookTags.name })
          .from(cookbookTags)
          .where(eq(cookbookTags.cookbookId, cookbook.id)),

        nomnomDb
          .select({ recipeId: cookbookRecipes.recipeId })
          .from(cookbookRecipes)
          .where(eq(cookbookRecipes.cookbookId, cookbook.id))
          .orderBy(cookbookRecipes.orderIndex),

        nomnomDb
          .select({ categoryId: cookbookCategories.categoryId })
          .from(cookbookCategories)
          .where(eq(cookbookCategories.cookbookId, cookbook.id)),
      ]);

      return {
        ...cookbook,
        tags: tags.map((t) => t.name),
        recipeIds: cookbookRecipesData.map((r) => r.recipeId),
        categoryIds: categories.map((c) => c.categoryId),
      };
    }),

  update: authProcedure
    .input(createCookbookSchema.extend({ cookbookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(cookbooks)
        .where(
          and(
            eq(cookbooks.id, input.cookbookId),
            eq(cookbooks.authorId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cookbook not found",
        });
      }

      await nomnomDb
        .update(cookbooks)
        .set({
          title: input.title,
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          bannerImageUrl: input.bannerImageUrl,
          cuisine: input.cuisine,
          difficulty: input.difficulty,
          servingsRange: input.servingsRange,
          language: input.language,
          edition: input.edition,
          isFree: input.isFree,
          price:
            input.price != null && input.price > 0
              ? input.price.toString()
              : null,
          currency: input.currency,
          status: input.status,
          publishedAt:
            input.status === "published" && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(cookbooks.id, input.cookbookId));

      await Promise.all([
        nomnomDb
          .delete(cookbookRecipes)
          .where(eq(cookbookRecipes.cookbookId, input.cookbookId)),
        nomnomDb
          .delete(cookbookCategories)
          .where(eq(cookbookCategories.cookbookId, input.cookbookId)),
        nomnomDb
          .delete(cookbookTags)
          .where(eq(cookbookTags.cookbookId, input.cookbookId)),
      ]);

      await Promise.all([
        input.recipeIds &&
          input.recipeIds.length > 0 &&
          nomnomDb.insert(cookbookRecipes).values(
            input.recipeIds.map((recipeId, index) => ({
              cookbookId: input.cookbookId,
              recipeId,
              orderIndex: index,
            })),
          ),
        input.categoryIds &&
          input.categoryIds.length > 0 &&
          nomnomDb.insert(cookbookCategories).values(
            input.categoryIds.map((categoryId) => ({
              cookbookId: input.cookbookId,
              categoryId,
            })),
          ),
        input.tags &&
          input.tags.length > 0 &&
          nomnomDb.insert(cookbookTags).values(
            input.tags.map((name) => ({
              cookbookId: input.cookbookId,
              name: name.toLowerCase().trim(),
            })),
          ),
      ]);

      return { slug: existing.slug };
    }),

  delete: authProcedure
    .input(z.object({ cookbookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(cookbooks)
        .where(
          and(
            eq(cookbooks.id, input.cookbookId),
            eq(cookbooks.authorId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cookbook not found",
        });
      }

      await nomnomDb
        .delete(cookbooks)
        .where(eq(cookbooks.id, input.cookbookId));

      return { success: true };
    }),

  createCheckoutSession: authProcedure
    .input(z.object({ cookbookSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Fetch the cookbook
      const cookbook = await nomnomDb
        .select()
        .from(cookbooks)
        .where(eq(cookbooks.slug, input.cookbookSlug))
        .then((rows) => rows[0]);

      if (!cookbook) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cookbook not found" });
      }

      if (cookbook.isFree || !cookbook.price) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This cookbook is free" });
      }

      if (cookbook.authorId === ctx.userId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot buy your own cookbook" });
      }

      // Check if already purchased
      const existing = await nomnomDb
        .select()
        .from(cookbookPurchases)
        .where(
          and(
            eq(cookbookPurchases.cookbookId, cookbook.id),
            eq(cookbookPurchases.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You already own this cookbook" });
      }

      const buyer = await nomnomDb
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      const priceInCents = Math.round(parseFloat(cookbook.price) * 100);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: cookbook.currency?.toLowerCase() ?? "usd",
              product_data: {
                name: cookbook.title,
                description: cookbook.description ?? undefined,
                images: cookbook.coverImageUrl ? [cookbook.coverImageUrl] : [],
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL}/${buyer.username}/cookbooks/saved?cookbookSlug=${cookbook.slug}`,
        cancel_url: `${process.env.APP_URL}/cookbooks/${cookbook.slug}`,
        metadata: {
          cookbookId: cookbook.id,
          userId: ctx.userId,
          pricePaid: cookbook.price,
          currency: cookbook.currency ?? "USD",
        },
      });

      return { url: session.url };
    }),
});
