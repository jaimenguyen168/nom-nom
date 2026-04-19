import { createTRPCRouter, authProcedure, publicProcedure } from "@/trpc/init";
import {
  recipes,
  createRecipeSchema,
  userSavedRecipes,
  recipeIngredients,
  recipeInstructions,
  recipeNutrition,
  recipeTags,
  recipeReviews,
  recipeCategories,
} from "@/db/schemas/recipes";
import { nomnomDb } from "@/db";
import { slugify } from "@/lib/utils";
import { users } from "@/db/schemas/users";
import { eq, and, ne, inArray, avg, desc, asc, sql, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { categories } from "@/db/schemas/categories";

export const recipesRouter = createTRPCRouter({
  create: authProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const [recipe] = await nomnomDb
        .insert(recipes)
        .values({
          title: input.title,
          slug: slugify(input.title),
          description: input.description,
          imageUrl: input.imageUrl,
          isPublic: input.isPublic,
          servings: input.servings ? parseInt(input.servings) : 1,
          prepTimeMinutes:
            input.prepTime.hours || input.prepTime.minutes
              ? parseInt(input.prepTime.hours || "0") * 60 +
                parseInt(input.prepTime.minutes || "0")
              : undefined,
          cookTimeMinutes:
            input.cookingTime.hours || input.cookingTime.minutes
              ? parseInt(input.cookingTime.hours || "0") * 60 +
                parseInt(input.cookingTime.minutes || "0")
              : undefined,
          userId: ctx.userId,
        })
        .returning();

      await Promise.all([
        input.ingredients.length > 0 &&
          nomnomDb.insert(recipeIngredients).values(
            input.ingredients.map((ing, index) => ({
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              isOptional: ing.isOptional,
              orderIndex: index,
              recipeId: recipe.id,
            })),
          ),

        input.instructions.length > 0 &&
          nomnomDb.insert(recipeInstructions).values(
            input.instructions.map((inst) => ({
              stepNumber: inst.stepNumber,
              instruction: inst.instruction,
              recipeId: recipe.id,
            })),
          ),

        input.nutrition.length > 0 &&
          nomnomDb.insert(recipeNutrition).values(
            input.nutrition.map((n) => ({
              nutrientName: n.nutrientName,
              amount: n.amount,
              unit: n.unit,
              recipeId: recipe.id,
            })),
          ),

        input.tags &&
          input.tags.length > 0 &&
          nomnomDb.insert(recipeTags).values(
            input.tags.map((tag) => ({
              name: tag,
              recipeId: recipe.id,
            })),
          ),

        input.categoryIds &&
          input.categoryIds.length > 0 &&
          nomnomDb.insert(recipeCategories).values(
            input.categoryIds.map((categoryId) => ({
              categoryId,
              recipeId: recipe.id,
            })),
          ),
      ]);

      const user = await nomnomDb
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { username: user.username, recipeSlug: recipe.slug };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        sortBy: z
          .enum(["trending", "popular", "new", "a_z", "relevance"])
          .default("new"),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, sortBy } = input;

      const orderBy =
        sortBy === "a_z"
          ? asc(recipes.title)
          : sortBy === "popular"
            ? desc(count(userSavedRecipes.id))
            : sortBy === "trending"
              ? desc(count(recipeTags.id))
              : sortBy === "relevance"
                ? desc(
                    sql`(
                      COALESCE(${avg(recipeReviews.rating)}, 0) * 0.4 +
                      COUNT(DISTINCT ${userSavedRecipes.id}) * 0.4 +
                      EXTRACT(EPOCH FROM ${recipes.createdAt}) / 1000000000 * 0.2
                    )`,
                  )
                : desc(recipes.createdAt);

      const data = await nomnomDb
        .select({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          createdAt: recipes.createdAt,
          isPublic: recipes.isPublic,
          rating: avg(recipeReviews.rating).as("rating"),
          calories:
            sql<number>`MAX(CASE WHEN ${recipeNutrition.nutrientName} = 'calories' THEN ${recipeNutrition.amount} END)`.as(
              "calories",
            ),
        })
        .from(recipes)
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeNutrition, eq(recipeNutrition.recipeId, recipes.id))
        .leftJoin(users, eq(recipes.userId, users.id))
        .leftJoin(userSavedRecipes, eq(userSavedRecipes.recipeId, recipes.id))
        .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
        .where(eq(recipes.isPublic, true))
        .groupBy(recipes.id, users.username, users.profileImageUrl)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(recipes)
        .where(eq(recipes.isPublic, true));

      return {
        items: data.map((r) => ({
          ...r,
          rating: r.rating ? parseFloat(r.rating) : 0,
          calories: r.calories ?? 0,
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await nomnomDb
        .select()
        .from(recipes)
        .innerJoin(users, eq(recipes.userId, users.id))
        .where(eq(recipes.slug, input.slug))
        .then((rows) => rows[0]);

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Recipe not found" });
      }

      const isOwner = ctx.userId === result.recipes.userId;

      if (!result.recipes.isPublic && !isOwner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Recipe not found" });
      }

      const recipeId = result.recipes.id;

      const [ingredients, instructions, nutrition, tags] = await Promise.all([
        nomnomDb
          .select()
          .from(recipeIngredients)
          .where(eq(recipeIngredients.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeInstructions)
          .where(eq(recipeInstructions.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeNutrition)
          .where(eq(recipeNutrition.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeTags)
          .where(eq(recipeTags.recipeId, recipeId)),
      ]);

      return { ...result, ingredients, instructions, nutrition, tags };
    }),

  getByUsernameAndSlug: publicProcedure
    .input(
      z.object({
        username: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await nomnomDb
        .select()
        .from(recipes)
        .innerJoin(users, eq(recipes.userId, users.id))
        .where(
          and(eq(users.username, input.username), eq(recipes.slug, input.slug)),
        )
        .then((rows) => rows[0]);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      const isOwner = ctx.userId === result.recipes.userId;

      if (!result.recipes.isPublic && !isOwner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      const recipeId = result.recipes.id;

      const [ingredients, instructions, nutrition, tags] = await Promise.all([
        nomnomDb
          .select()
          .from(recipeIngredients)
          .where(eq(recipeIngredients.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeInstructions)
          .where(eq(recipeInstructions.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeNutrition)
          .where(eq(recipeNutrition.recipeId, recipeId)),
        nomnomDb
          .select()
          .from(recipeTags)
          .where(eq(recipeTags.recipeId, recipeId)),
      ]);

      return {
        ...result,
        ingredients,
        instructions,
        nutrition,
        tags,
      };
    }),

  toggleSave: authProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(userSavedRecipes)
        .where(
          and(
            eq(userSavedRecipes.userId, ctx.userId),
            eq(userSavedRecipes.recipeId, input.recipeId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(userSavedRecipes)
          .where(
            and(
              eq(userSavedRecipes.userId, ctx.userId),
              eq(userSavedRecipes.recipeId, input.recipeId),
            ),
          );
        return { isSaved: false };
      }

      await nomnomDb
        .insert(userSavedRecipes)
        .values({ userId: ctx.userId, recipeId: input.recipeId });

      return { isSaved: true };
    }),

  isSaved: authProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(userSavedRecipes)
        .where(
          and(
            eq(userSavedRecipes.userId, ctx.userId),
            eq(userSavedRecipes.recipeId, input.recipeId),
          ),
        )
        .then((rows) => rows[0]);

      return { isSaved: !!existing };
    }),

  savesCount: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ input }) => {
      const total = await nomnomDb
        .select()
        .from(userSavedRecipes)
        .where(eq(userSavedRecipes.recipeId, input.recipeId))
        .then((rows) => rows.length);

      return { savesCount: total };
    }),

  getRecommendations: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ input }) => {
      const currentTags = await nomnomDb
        .select()
        .from(recipeTags)
        .where(eq(recipeTags.recipeId, input.recipeId));

      const tagNames = currentTags.map((t) => t.name);

      const baseQuery =
        tagNames.length > 0
          ? and(
              eq(recipes.isPublic, true),
              ne(recipes.id, input.recipeId),
              inArray(recipeTags.name, tagNames),
            )
          : and(eq(recipes.isPublic, true), ne(recipes.id, input.recipeId));

      const results = await nomnomDb
        .selectDistinct({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          username: users.username,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          isPublic: recipes.isPublic,
          createdAt: recipes.createdAt,
          rating: avg(recipeReviews.rating).as("rating"),
        })
        .from(recipes)
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
        .leftJoin(users, eq(recipes.userId, users.id))
        .where(baseQuery)
        .groupBy(recipes.id, users.username)
        .limit(6);

      return results.map((r) => ({
        ...r,
        rating: r.rating ? parseFloat(r.rating) : 0,
      }));
    }),

  getBySameCategories: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ input }) => {
      const currentCategories = await nomnomDb
        .select()
        .from(recipeCategories)
        .where(eq(recipeCategories.recipeId, input.recipeId));

      const categoryIds = currentCategories.map((c) => c.categoryId);

      const baseQuery =
        categoryIds.length > 0
          ? and(
              eq(recipes.isPublic, true),
              ne(recipes.id, input.recipeId),
              inArray(recipeCategories.categoryId, categoryIds),
            )
          : and(eq(recipes.isPublic, true), ne(recipes.id, input.recipeId));

      const results = await nomnomDb
        .selectDistinct({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          username: users.username,
          isPublic: recipes.isPublic,
          createdAt: recipes.createdAt,
          rating: avg(recipeReviews.rating).as("rating"),
        })
        .from(recipes)
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeCategories, eq(recipeCategories.recipeId, recipes.id))
        .leftJoin(users, eq(recipes.userId, users.id))
        .where(baseQuery)
        .groupBy(recipes.id, users.username)
        .limit(6);

      return results.map((r) => ({
        ...r,
        rating: r.rating ? parseFloat(r.rating) : 0,
      }));
    }),

  getManyByCategory: publicProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        sortBy: z
          .enum(["trending", "popular", "new", "a_z", "relevance"])
          .default("new"),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, sortBy, categorySlug } = input;

      const orderBy =
        sortBy === "a_z"
          ? asc(recipes.title)
          : sortBy === "popular"
            ? desc(count(userSavedRecipes.id))
            : sortBy === "trending"
              ? desc(count(recipeTags.id))
              : sortBy === "relevance"
                ? desc(
                    sql`(
                      COALESCE(${avg(recipeReviews.rating)}, 0) * 0.4 +
                      COUNT(DISTINCT ${userSavedRecipes.id}) * 0.4 +
                      EXTRACT(EPOCH FROM ${recipes.createdAt}) / 1000000000 * 0.2
                    )`,
                  )
                : desc(recipes.createdAt);

      const data = await nomnomDb
        .select({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          createdAt: recipes.createdAt,
          isPublic: recipes.isPublic,
          rating: avg(recipeReviews.rating).as("rating"),
          calories:
            sql<number>`MAX(CASE WHEN ${recipeNutrition.nutrientName} = 'calories' THEN ${recipeNutrition.amount} END)`.as(
              "calories",
            ),
        })
        .from(recipes)
        .innerJoin(recipeCategories, eq(recipeCategories.recipeId, recipes.id))
        .innerJoin(categories, eq(categories.id, recipeCategories.categoryId))
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeNutrition, eq(recipeNutrition.recipeId, recipes.id))
        .leftJoin(users, eq(recipes.userId, users.id))
        .leftJoin(userSavedRecipes, eq(userSavedRecipes.recipeId, recipes.id))
        .leftJoin(recipeTags, eq(recipeTags.recipeId, recipes.id))
        .where(
          and(eq(recipes.isPublic, true), eq(categories.key, categorySlug)),
        )
        .groupBy(recipes.id, users.username, users.profileImageUrl)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(recipes)
        .innerJoin(recipeCategories, eq(recipeCategories.recipeId, recipes.id))
        .innerJoin(categories, eq(categories.id, recipeCategories.categoryId))
        .where(
          and(eq(recipes.isPublic, true), eq(categories.key, categorySlug)),
        );

      return {
        items: data.map((r) => ({
          ...r,
          rating: r.rating ? parseFloat(r.rating) : 0,
          calories: r.calories ?? 0,
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),

  update: authProcedure
    .input(createRecipeSchema.extend({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(recipes)
        .where(
          and(eq(recipes.id, input.recipeId), eq(recipes.userId, ctx.userId)),
        )
        .then((rows) => rows[0]);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Recipe not found" });
      }

      await nomnomDb
        .update(recipes)
        .set({
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          isPublic: input.isPublic,
          servings: input.servings ? parseInt(input.servings) : 1,
          prepTimeMinutes:
            input.prepTime.hours || input.prepTime.minutes
              ? parseInt(input.prepTime.hours || "0") * 60 +
                parseInt(input.prepTime.minutes || "0")
              : undefined,
          cookTimeMinutes:
            input.cookingTime.hours || input.cookingTime.minutes
              ? parseInt(input.cookingTime.hours || "0") * 60 +
                parseInt(input.cookingTime.minutes || "0")
              : undefined,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, input.recipeId));

      await Promise.all([
        nomnomDb
          .delete(recipeIngredients)
          .where(eq(recipeIngredients.recipeId, input.recipeId)),
        nomnomDb
          .delete(recipeInstructions)
          .where(eq(recipeInstructions.recipeId, input.recipeId)),
        nomnomDb
          .delete(recipeNutrition)
          .where(eq(recipeNutrition.recipeId, input.recipeId)),
        nomnomDb
          .delete(recipeTags)
          .where(eq(recipeTags.recipeId, input.recipeId)),
        nomnomDb
          .delete(recipeCategories)
          .where(eq(recipeCategories.recipeId, input.recipeId)),
      ]);

      await Promise.all([
        input.ingredients.length > 0 &&
          nomnomDb.insert(recipeIngredients).values(
            input.ingredients.map((ing, index) => ({
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              isOptional: ing.isOptional,
              orderIndex: index,
              recipeId: input.recipeId,
            })),
          ),
        input.instructions.length > 0 &&
          nomnomDb.insert(recipeInstructions).values(
            input.instructions.map((inst) => ({
              stepNumber: inst.stepNumber,
              instruction: inst.instruction,
              recipeId: input.recipeId,
            })),
          ),
        input.nutrition.length > 0 &&
          nomnomDb.insert(recipeNutrition).values(
            input.nutrition.map((n) => ({
              nutrientName: n.nutrientName,
              amount: n.amount,
              unit: n.unit,
              recipeId: input.recipeId,
            })),
          ),
        input.tags &&
          input.tags.length > 0 &&
          nomnomDb.insert(recipeTags).values(
            input.tags.map((tag) => ({
              name: tag,
              recipeId: input.recipeId,
            })),
          ),
        input.categoryIds &&
          input.categoryIds.length > 0 &&
          nomnomDb.insert(recipeCategories).values(
            input.categoryIds.map((categoryId) => ({
              categoryId,
              recipeId: input.recipeId,
            })),
          ),
      ]);

      return { recipeSlug: existing.slug, username: ctx.userId };
    }),

  getManyByUser: authProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(12),
        status: z.enum(["all", "public", "private"]).default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status } = input;

      const whereClause =
        status === "all"
          ? eq(recipes.userId, ctx.userId)
          : status === "public"
            ? and(eq(recipes.userId, ctx.userId), eq(recipes.isPublic, true))
            : and(eq(recipes.userId, ctx.userId), eq(recipes.isPublic, false));

      const data = await nomnomDb
        .select({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          isPublic: recipes.isPublic,
          createdAt: recipes.createdAt,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          rating: avg(recipeReviews.rating).as("rating"),
          calories:
            sql<number>`MAX(CASE WHEN ${recipeNutrition.nutrientName} = 'calories' THEN ${recipeNutrition.amount} END)`.as(
              "calories",
            ),
        })
        .from(recipes)
        .leftJoin(users, eq(recipes.userId, users.id))
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeNutrition, eq(recipeNutrition.recipeId, recipes.id))
        .where(whereClause)
        .groupBy(recipes.id, users.username, users.profileImageUrl)
        .orderBy(desc(recipes.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(recipes)
        .where(whereClause);

      return {
        items: data.map((r) => ({
          ...r,
          rating: r.rating ? parseFloat(r.rating) : 0,
          calories: r.calories ?? 0,
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
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
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          imageUrl: recipes.imageUrl,
          userId: recipes.userId,
          isPublic: recipes.isPublic,
          createdAt: recipes.createdAt,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          rating: avg(recipeReviews.rating).as("rating"),
          calories:
            sql<number>`MAX(CASE WHEN ${recipeNutrition.nutrientName} = 'calories' THEN ${recipeNutrition.amount} END)`.as(
              "calories",
            ),
        })
        .from(userSavedRecipes)
        .innerJoin(recipes, eq(recipes.id, userSavedRecipes.recipeId))
        .leftJoin(users, eq(recipes.userId, users.id))
        .leftJoin(recipeReviews, eq(recipeReviews.recipeId, recipes.id))
        .leftJoin(recipeNutrition, eq(recipeNutrition.recipeId, recipes.id))
        .where(
          and(
            eq(userSavedRecipes.userId, ctx.userId),
            eq(recipes.isPublic, true),
          ),
        )
        .groupBy(recipes.id, users.username, users.profileImageUrl)
        .orderBy(desc(recipes.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(userSavedRecipes)
        .innerJoin(recipes, eq(recipes.id, userSavedRecipes.recipeId))
        .where(
          and(
            eq(userSavedRecipes.userId, ctx.userId),
            eq(recipes.isPublic, true),
          ),
        );

      return {
        items: data.map((r) => ({
          ...r,
          rating: r.rating ? parseFloat(r.rating) : 0,
          calories: r.calories ?? 0,
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),
});
