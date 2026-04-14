import { createTRPCRouter, authProcedure } from "@/trpc/init";
import { recipes, createRecipeSchema } from "@/db/schemas/recipes";
import { nomnomDb } from "@/db";

export const recipesRouter = createTRPCRouter({
  create: authProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const [recipe] = await nomnomDb
        .insert(recipes)
        .values({
          title: input.title,
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

      return recipe;
    }),
});
