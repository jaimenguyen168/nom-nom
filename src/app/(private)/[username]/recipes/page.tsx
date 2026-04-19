import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import UserRecipesView from "@/features/recipes/views/user-recipes-view";
import RecipeDetailsView from "@/features/recipes/views/recipe-details-view";

export default async function UserRecipesPage({
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

  prefetch(trpc.recipes.getManyByUser.queryOptions({}));

  return (
    <HydrateClient>
      <UserRecipesView username={username} />
    </HydrateClient>
  );
}
