import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetRecipesBySameCategories } from "@/hooks/trpcHooks/use-recipes";

const RecipeCategoryGrid = ({ recipeId }: { recipeId: string }) => {
  const { data: recipes } = useGetRecipesBySameCategories(recipeId);

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Related Recipes</h2>
      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.slug}`}
            className="flex flex-col items-center text-center hover:bg-gray-50 transition-colors rounded-lg"
          >
            <div className="w-full mb-3">
              <Image
                src={recipe.imageUrl || "/no-image.svg"}
                alt={recipe.title}
                width={200}
                height={200}
                className="w-full h-32 rounded-lg object-cover"
              />
            </div>
            <h3 className="text-gray-800 font-medium text-sm leading-tight line-clamp-2 px-2">
              {recipe.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeCategoryGrid;
