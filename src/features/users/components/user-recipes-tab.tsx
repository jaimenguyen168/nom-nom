"use client";

import React from "react";
import { useGetPublicRecipesByUsername } from "@/hooks/trpcHooks/use-recipes";
import RecipeCard from "@/features/recipes/components/recipe-card";
import AppPagination from "@/components/app-pagination";
import { Grid3X3 } from "lucide-react";
import { UserEmptyState } from "./user-empty-state";

interface Props {
  username: string;
  page: number;
  onPageChange: (p: number) => void;
}

export function UserRecipesTab({ username, page, onPageChange }: Props) {
  const { data } = useGetPublicRecipesByUsername(username, page);
  const items = data?.items ?? [];

  if (items.length === 0)
    return (
      <UserEmptyState
        icon={<Grid3X3 className="size-9 text-gray-200" />}
        message="No public recipes yet."
      />
    );

  return (
    <div className="space-y-8 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
