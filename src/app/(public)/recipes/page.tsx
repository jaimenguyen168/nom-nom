import React from "react";
import RecipesView from "@/features/recipes/views/recipes-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default function RecipesPage() {
  prefetch(trpc.recipes.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <RecipesView />
    </HydrateClient>
  );
}
