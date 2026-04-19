import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { nomnomDb } from "@/db";
import { categories } from "@/db/schemas/categories";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const categoriesRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async () => {
    return nomnomDb.select().from(categories);
  }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      return nomnomDb
        .select()
        .from(categories)
        .where(
          sql`LOWER(${categories.name}) LIKE LOWER(${"%" + input.query + "%"})`,
        )
        .limit(5);
    }),
});
