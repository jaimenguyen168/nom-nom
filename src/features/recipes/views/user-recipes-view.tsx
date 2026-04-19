"use client";

import React, { useEffect, useState } from "react";
import {
  RecipeStatusFilter,
  useGetMyRecipes,
} from "@/hooks/trpcHooks/use-recipes";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import AppPagination from "@/components/app-pagination";
import { PAGE_SIZE } from "@/features/recipes/constants";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserRecipeCard from "@/features/recipes/components/user-recipe-card";

const statusFilters: { label: string; value: RecipeStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

const UserRecipesView = ({ username }: { username: string }) => {
  const { data: currentUser } = useGetCurrentUser();
  const router = useRouter();
  const [status, setStatus] = useState<RecipeStatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data } = useGetMyRecipes(status, PAGE_SIZE, page);
  const recipes = data?.items ?? [];

  useEffect(() => {
    if (currentUser?.username !== username) {
      router.replace("/recipes");
    }
  }, [currentUser?.username, username, router]);

  if (currentUser?.username !== username) return null;

  const handleStatusChange = (value: RecipeStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <Link href={`/${username}/recipes/new`}>
            <PlusCircle className="size-7 text-primary-200 cursor-pointer hover:text-primary-200/80" />
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={status === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(filter.value)}
            className={
              status === filter.value
                ? "bg-primary-200 hover:bg-primary-300"
                : ""
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start creating your first recipe.
          </p>
          <Link href={`/${username}/recipes/new`}>
            <span className="text-primary-200 font-medium hover:text-primary-200/80">
              Create a recipe →
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <UserRecipeCard key={recipe.id} recipe={recipe} />
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

export default UserRecipesView;
