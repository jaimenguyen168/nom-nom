import { createTRPCRouter, authProcedure } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { z } from "zod";
import { createRecipeWithAgentEvent } from "@/inngest/recipe-functions";
import { nomnomDb } from "@/db";
import { categories } from "@/db/schemas/categories";
import {
  assertRecipeLimit,
  getOrCreateUsage,
  incrementRecipeUsage,
} from "@/features/billing/lib/usage";

export const recipesAgentRouter = createTRPCRouter({
  createWithAgent: authProcedure
    .input(z.object({ prompt: z.string().min(1, "Prompt is required") }))
    .mutation(async ({ ctx, input }) => {
      // 1. Enforce plan limit — throws FORBIDDEN if exceeded
      await assertRecipeLimit(ctx.userId, ctx.has);

      // 2. Ensure usage row exists before we fire the background job
      await getOrCreateUsage(ctx.userId);

      const availableCategories = await nomnomDb
        .select({
          id: categories.id,
          key: categories.key,
          name: categories.name,
        })
        .from(categories);

      const result = await inngest.send({
        name: createRecipeWithAgentEvent,
        data: {
          prompt: input.prompt,
          userId: ctx.userId,
          availableCategories,
        },
      });

      // 3. Increment usage now that the job is queued
      await incrementRecipeUsage(ctx.userId);

      return {
        success: true,
        eventId: result.ids[0],
      };
    }),
});
