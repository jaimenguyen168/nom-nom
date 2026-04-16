import React from "react";
import RecipeDetailsView from "@/features/recipes/views/recipe-details-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ username: string; recipeSlug: string }>;
}) {
  const { username, recipeSlug } = await params;

  prefetch(
    trpc.recipes.getByUsernameAndSlug.queryOptions({
      username,
      slug: recipeSlug,
    }),
  );

  return (
    <HydrateClient>
      <RecipeDetailsView username={username} recipeSlug={recipeSlug} />
    </HydrateClient>
  );
}
