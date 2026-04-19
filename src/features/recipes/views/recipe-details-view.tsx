"use client";

import React from "react";
import { useGetRecipeBySlug } from "@/hooks/trpcHooks/use-recipes";
import ContactSection from "@/components/contact-section";
import TitleInfoHeader from "@/features/recipes/components/title-info-header";
import PrepInfo from "@/features/recipes/components/prep-info";
import IngredientsInfo from "@/features/recipes/components/ingredients-info";
import InstructionsInfo from "@/features/recipes/components/instructions-info";
import CommentsSection from "@/features/recipes/components/comments-section";
import TagsSection from "@/components/tags-section";
import Image from "next/image";
import CallToAction from "@/components/call-to-action";
import NutritionFactsSection from "@/features/recipes/components/nutrition-facts-section";
import RecipeRecommendationGrid from "@/features/recipes/components/recipe-recommendation-grid";
import RecipeCategoryList from "@/features/recipes/components/recipe-category-list";
import RecipeCategoryGrid from "@/features/recipes/components/recipe-category-grid";

interface Props {
  recipeSlug: string;
}

export default function RecipeDetailsView({ recipeSlug }: Props) {
  const { data } = useGetRecipeBySlug(recipeSlug);

  const recipe = data.recipes;
  const user = data.users;
  const ingredients = data.ingredients;
  const instructions = data.instructions;
  const nutrition = data.nutrition;
  const tags = data.tags;

  return (
    <div>
      {/* Title + Call to Action */}
      <div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <TitleInfoHeader
          type="recipe"
          recipeId={recipe.id}
          title={recipe.title}
          authorId={user.id}
          authorName={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
          authorProfileImageUrl={user.profileImageUrl ?? undefined}
          date={recipe.createdAt?.toISOString() ?? ""}
          commentsCount={0}
          rating={0}
          ratingCount={0}
        />
        <div className="mb-2 sm:mt-2 shrink-0">
          <CallToAction
            type="recipe"
            recipeId={recipe.id}
            username={user.username as string}
            slug={recipeSlug}
            authorId={user.id}
          />
        </div>
      </div>

      {/* Main Layout - Two Columns */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column */}
        <div className="flex-1 lg:w-2/3">
          {/* Recipe Image */}
          <div className="mb-6">
            <Image
              src={recipe.imageUrl || "/no-image.svg"}
              alt={recipe.title}
              width={800}
              height={600}
              className="rounded-lg object-cover w-full h-144"
            />
          </div>

          {/* Prep Info */}
          <PrepInfo
            prepTime={recipe.prepTimeMinutes ?? 0}
            cookTime={recipe.cookTimeMinutes ?? 0}
            serving={recipe.servings ?? 1}
          />

          {/* Ingredients */}
          <IngredientsInfo
            ingredients={ingredients}
            description={recipe.description ?? undefined}
          />

          {/* Instructions */}
          <InstructionsInfo instructions={instructions} />

          {/* Comments */}
          <CommentsSection
            comments={[]}
            onLike={(id) => console.log("Liked:", id)}
            onReply={(text, id) => console.log("Reply:", id, text)}
            onRateAndReview={(rating, text) =>
              console.log("Review:", rating, text)
            }
          />

          <RecipeRecommendationGrid recipeId={recipe.id} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <NutritionFactsSection
            nutrition={nutrition}
            className="w-full rounded-lg p-6"
          />

          <RecipeCategoryList categoryTitle="Recent Recipes" category="new" />

          <ContactSection />

          <RecipeCategoryGrid recipeId={recipe.id} />

          <RecipeCategoryList
            categoryTitle="Trending Recipes"
            category="trending"
          />

          <TagsSection tags={tags} />
        </div>
      </div>
    </div>
  );
}
