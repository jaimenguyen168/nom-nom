import { createTRPCRouter } from "../init";
import { recipesRouter } from "@/trpc/routers/recipesProcedure";

export const appRouter = createTRPCRouter({
  recipes: recipesRouter,
});

export type AppRouter = typeof appRouter;
