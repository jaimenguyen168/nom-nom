import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import StarRatings from "@/components/star-ratings";

interface RecipePreviewProps {
  recipeId: string;
  recipeName: string;
  recipeImageUrl: string | null;
  recipeRating: number;
}

const RecipePreview = ({
  recipeId,
  recipeName,
  recipeImageUrl,
  recipeRating,
}: RecipePreviewProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/recipes/${recipeId}`);
  };

  return (
    <Card
      onClick={handleNavigation}
      className="bg-white rounded-lg overflow-hidden cursor-pointer py-0"
    >
      <div className="relative">
        <Image
          src={recipeImageUrl || "/no-image.svg"}
          alt={recipeName}
          width={200}
          height={200}
          className="w-full h-36 object-cover"
        />
      </div>

      <div className="px-4 pb-6">
        <div className="mb-2">
          <StarRatings rating={recipeRating} />
        </div>

        <h3 className="text-gray-800 font-medium text-sm leading-tight line-clamp-2">
          {recipeName}
        </h3>
      </div>
    </Card>
  );
};

export default RecipePreview;
