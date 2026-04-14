import { createTRPCRouter, authProcedure, publicProcedure } from "@/trpc/init";
import { recipes, createRecipeSchema } from "@/db/schemas/recipes";
import { nomnomDb } from "@/db";
import { slugify } from "@/lib/utils";
import { users } from "@/db/schemas/users";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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

      const user = await nomnomDb
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { username: user.username, recipeSlug: recipe.slug };
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
          message: "You do not have permission to view this recipe",
        });
      }

      return result;
    }),
});
