"use client";

import React from "react";
import Image from "next/image";
import { Flame, Heart, UserCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import StarRatings from "@/components/star-ratings";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  useIsSavedRecipe,
  useToggleSaveRecipe,
} from "@/hooks/trpcHooks/use-recipes";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    userId: string;
    username: string | null;
    profileImageUrl: string | null;
    rating: number;
    calories: number;
  };
  categoryContext?: { slug: string; name: string };
  href?: string;
}

const RecipeCard = ({ recipe, categoryContext, href }: RecipeCardProps) => {
  const router = useRouter();
  const { data: saveData } = useIsSavedRecipe(recipe.id);
  const isSaved = saveData?.isSaved ?? false;

  const username = recipe.username ?? "";
  const userProfileImageUrl = recipe.profileImageUrl ?? undefined;

  const { handleToggleSave, isPending } = useToggleSaveRecipe(
    recipe.id,
    username ?? "",
    recipe.slug,
  );

  const handleNavigation = () => {
    if (categoryContext) {
      router.push(
        `/categories/${categoryContext.slug}?categoryName=${categoryContext.name}&recipeSlug=${recipe.slug}`,
      );
    } else {
      router.push(href ?? `/recipes/${recipe.slug}`);
    }
  };

  const handleGoToAuthor = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/users/${username}`);
  };

  return (
    <Card
      onClick={handleNavigation}
      className="rounded-xl py-0 shadow-md border overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform duration-300"
    >
      <div className="relative w-full h-48">
        <Image
          src={recipe.imageUrl || "/no-image.svg"}
          alt={recipe.title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleSave();
          }}
          disabled={isPending}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10 hover:scale-105"
        >
          <Heart
            className={cn(
              "size-4",
              isSaved
                ? "fill-primary-200 text-primary-200"
                : "text-primary-200",
            )}
          />
        </button>
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-2 rounded-lg shadow text-xs font-medium text-gray-700 z-10">
          <Flame size={12} className="text-primary-200" />
          {recipe.calories} cals
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <StarRatings rating={recipe.rating} />
        <h3 className="font-semibold text-sm md:text-base capitalize overflow-hidden line-clamp-2 leading-snug min-h-13">
          {recipe.title}
        </h3>
        <div
          onClick={handleGoToAuthor}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 min-w-0 text-sm font-medium text-gray-600"
        >
          {userProfileImageUrl ? (
            <Image
              src={userProfileImageUrl}
              alt={username}
              width={100}
              height={100}
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <UserCircleIcon className="size-4 text-primary-200 shrink-0" />
          )}
          <span className="truncate">{username}</span>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
