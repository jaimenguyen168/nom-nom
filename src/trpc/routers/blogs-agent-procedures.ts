import { createTRPCRouter, authProcedure } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { z } from "zod";
import { createBlogWithAgentEvent } from "@/inngest/blog-functions";
import { nomnomDb } from "@/db";
import { categories } from "@/db/schemas/categories";

export const blogsAgentRouter = createTRPCRouter({
  createWithAgent: authProcedure
    .input(z.object({ prompt: z.string().min(1, "Prompt is required") }))
    .mutation(async ({ ctx, input }) => {
      const availableCategories = await nomnomDb
        .select({
          id: categories.id,
          key: categories.key,
          name: categories.name,
        })
        .from(categories);

      const result = await inngest.send({
        name: createBlogWithAgentEvent,
        data: {
          prompt: input.prompt,
          userId: ctx.userId,
          availableCategories,
        },
      });

      return {
        success: true,
        eventId: result.ids[0],
      };
    }),
});
