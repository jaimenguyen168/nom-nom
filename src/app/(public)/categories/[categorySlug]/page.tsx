import React from "react";
import CategoryBasedView from "@/features/categories/views/category-based-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import RecipeDetailsView from "@/features/recipes/views/recipe-details-view";

export default async function CategoryBasedPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ categoryName?: string; recipeSlug?: string }>;
}) {
  const { categorySlug } = await params;
  const { categoryName, recipeSlug } = await searchParams;

  if (recipeSlug) {
    prefetch(trpc.recipes.getBySlug.queryOptions({ slug: recipeSlug }));

    return (
      <HydrateClient>
        <RecipeDetailsView recipeSlug={recipeSlug} />
      </HydrateClient>
    );
  }

  prefetch(trpc.recipes.getManyByCategory.queryOptions({ categorySlug }));

  return (
    <HydrateClient>
      <CategoryBasedView
        categorySlug={categorySlug}
        categoryName={categoryName ?? ""}
      />
    </HydrateClient>
  );
}
