"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRatings from "@/components/star-ratings";
import { useRecipeRecommendations } from "@/hooks/trpcHooks/use-recipes";

interface RecipeRecommendationGridProps {
  recipeId: string;
}

const RecipeRecommendationGrid = ({
  recipeId,
}: RecipeRecommendationGridProps) => {
  const { data: recipes } = useRecipeRecommendations(recipeId);

  return (
    <div className="w-full mx-auto bg-white pt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/${recipe.username}/${recipe.slug}`}
            className="flex flex-col rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
          >
            <Image
              src={recipe.imageUrl || "/no-image.svg"}
              alt={recipe.title}
              width={200}
              height={200}
              className="w-full h-36 object-cover rounded-lg"
            />
            <div className="px-2 pt-2 pb-4 space-y-1">
              <StarRatings rating={recipe.rating} />
              <h3 className="text-gray-800 font-medium text-sm leading-tight line-clamp-2">
                {recipe.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeRecommendationGrid;
