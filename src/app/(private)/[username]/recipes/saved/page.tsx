import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import SavedRecipesView from "@/features/recipes/views/saved-recipes-view";
import RecipeDetailsView from "@/features/recipes/views/recipe-details-view";

export default async function SavedRecipesPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ recipeSlug?: string }>;
}) {
  const { username } = await params;
  const { recipeSlug } = await searchParams;

  if (recipeSlug) {
    prefetch(trpc.recipes.getBySlug.queryOptions({ slug: recipeSlug }));

    return (
      <HydrateClient>
        <RecipeDetailsView recipeSlug={recipeSlug} />
      </HydrateClient>
    );
  }

  prefetch(trpc.recipes.getSavedByUser.queryOptions({}));

  return (
    <HydrateClient>
      <SavedRecipesView username={username} />
    </HydrateClient>
  );
}
