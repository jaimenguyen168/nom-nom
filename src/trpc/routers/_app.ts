import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipesProcedures";
import { categoriesRouter } from "@/trpc/routers/categoriesProcedures";

export const appRouter = createTRPCRouter({
  recipes: recipesRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
