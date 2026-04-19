import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import EditRecipeView from "@/features/recipes/views/edit-recipe-view";

export default async function EditRecipePage({
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
      <EditRecipeView username={username} recipeSlug={recipeSlug} />
    </HydrateClient>
  );
}
