import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { nomnomDb } from "@/db";
import { categories } from "@/db/schemas/categories";

export const categoriesRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async () => {
    return nomnomDb.select().from(categories);
  }),
});
