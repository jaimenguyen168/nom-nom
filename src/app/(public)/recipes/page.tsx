import React from "react";
import RecipesView from "@/features/recipes/views/recipes-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default function PublicRecipesPage() {
  prefetch(trpc.recipes.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <RecipesView />
    </HydrateClient>
  );
}
