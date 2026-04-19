"use client";

import React, { useState } from "react";
import { useGetSavedRecipes } from "@/hooks/trpcHooks/use-recipes";
import RecipeCard from "@/features/recipes/components/recipe-card";
import AppPagination from "@/components/app-pagination";
import { PAGE_SIZE } from "@/features/recipes/constants";

const SavedRecipesView = ({ username }: { username: string }) => {
  const [page, setPage] = useState(1);
  const { data } = useGetSavedRecipes(PAGE_SIZE, page);
  const recipes = data?.items ?? [];

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-bold">Saved Recipes</h1>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No saved recipes yet
          </h3>
          <p className="text-gray-500">
            Save recipes you love and they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              href={`/${username}/recipes/saved?recipeSlug=${recipe.slug}`}
            />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default SavedRecipesView;
