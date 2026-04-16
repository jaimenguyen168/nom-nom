import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipesProcedures";
import { categoriesRouter } from "@/trpc/routers/categoriesProcedures";
import { blogsRouter } from "@/trpc/routers/blogsProcedures";

export const appRouter = createTRPCRouter({
  recipes: recipesRouter,
  categories: categoriesRouter,
  blogs: blogsRouter,
});

export type AppRouter = typeof appRouter;
