import React from "react";
import { useRecipeRecommendations } from "@/hooks/trpcHooks/use-recipes";
import RecipePreview from "@/features/recipes/components/recipe-preview";

export interface RecipeRecommendationGridProps {
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
          <RecipePreview
            key={recipe.id}
            recipeId={recipe.id}
            recipeName={recipe.title}
            recipeImageUrl={recipe.imageUrl}
            recipeRating={recipe.rating}
          />
        ))}
      </div>
    </div>
  );
};
export default RecipeRecommendationGrid;
