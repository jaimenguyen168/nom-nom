import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipesProcedures";
import { categoriesRouter } from "@/trpc/routers/categoriesProcedures";
import { blogsRouter } from "@/trpc/routers/blogsProcedures";
import { recipesAgentRouter } from "@/trpc/routers/recipesAgentProcedures";
import { blogsAgentRouter } from "@/trpc/routers/blogs-agent-procedures";

export const appRouter = createTRPCRouter({
  recipes: recipesRouter,
  recipesAgent: recipesAgentRouter,
  categories: categoriesRouter,
  blogs: blogsRouter,
  blogsAgent: blogsAgentRouter,
});

export type AppRouter = typeof appRouter;
