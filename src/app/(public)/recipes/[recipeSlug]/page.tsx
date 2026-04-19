import React from "react";
import RecipeDetailsView from "@/features/recipes/views/recipe-details-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ recipeSlug: string }>;
}) {
  const { recipeSlug } = await params;

  prefetch(
    trpc.recipes.getBySlug.queryOptions({
      slug: recipeSlug,
    }),
  );

  return (
    <HydrateClient>
      <RecipeDetailsView recipeSlug={recipeSlug} />
    </HydrateClient>
  );
}
