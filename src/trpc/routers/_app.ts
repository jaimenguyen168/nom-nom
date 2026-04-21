import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipes-procedures";
import { categoriesRouter } from "@/trpc/routers/categories-procedures";
import { blogsRouter } from "@/trpc/routers/blogs-procedures";
import { recipesAgentRouter } from "@/trpc/routers/recipes-agent-procedures";
import { blogsAgentRouter } from "@/trpc/routers/blogs-agent-procedures";
import { usersRouter } from "@/trpc/routers/users-procedures";
import { recipeReviewsRouter } from "@/trpc/routers/reviews-procedures";
import { blogReviewsRouter } from "@/trpc/routers/blog-reviews-procedures";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  recipes: recipesRouter,
  recipesAgent: recipesAgentRouter,
  categories: categoriesRouter,
  blogs: blogsRouter,
  blogsAgent: blogsAgentRouter,
  recipeReviews: recipeReviewsRouter,
  blogReviews: blogReviewsRouter,
});

export type AppRouter = typeof appRouter;
