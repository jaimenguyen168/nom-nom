import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipes-procedures";
import { categoriesRouter } from "@/trpc/routers/categories-procedures";
import { blogsRouter } from "@/trpc/routers/blogs-procedures";
import { recipesAgentRouter } from "@/trpc/routers/recipes-agent-procedures";
import { blogsAgentRouter } from "@/trpc/routers/blogs-agent-procedures";

export const appRouter = createTRPCRouter({
  recipes: recipesRouter,
  recipesAgent: recipesAgentRouter,
  categories: categoriesRouter,
  blogs: blogsRouter,
  blogsAgent: blogsAgentRouter,
});

export type AppRouter = typeof appRouter;
