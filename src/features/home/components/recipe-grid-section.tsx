"use client";

import React from "react";
import RecipeCard from "@/features/recipes/components/recipe-card";
import { useGetRecipes } from "@/hooks/trpcHooks/use-recipes";
import { useRouter } from "next/navigation";

type RecipeFeedType = "trending" | "popular" | "new" | "a_z" | "relevance";

interface RecipeGridSectionProps {
  feedType: RecipeFeedType;
  pageSize?: number;
  title?: string;
}

const RecipeGridSection = ({
  feedType,
  pageSize = 6,
  title,
}: RecipeGridSectionProps) => {
  const router = useRouter();
  const { data } = useGetRecipes(feedType, pageSize, 1);
  const recipes = data?.items ?? [];

  const sectionTitle =
    title ?? `${feedType.charAt(0).toUpperCase() + feedType.slice(1)} Recipes`;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{sectionTitle}</h2>
        <button
          onClick={() => router.push(`/recipes?sortBy=${feedType}`)}
          className="text-primary-200 font-medium cursor-pointer hover:text-primary-200/80"
        >
          View more
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipeGridSection;
