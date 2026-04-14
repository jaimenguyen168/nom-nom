"use client";

import React from "react";
import { useGetRecipe } from "@/hooks/trpcHooks/use-recipes";
import ContactSection from "@/components/contact-section";
import TitleInfoHeader from "@/features/recipes/components/title-info-header";
import PrepInfo from "@/features/recipes/components/prep-info";
import IngredientsInfo from "@/features/recipes/components/ingredients-info";
import InstructionsInfo from "@/features/recipes/components/instructions-info";
import CommentsSection from "@/features/recipes/components/comments-section";
import TagsSection from "@/components/tags-section";
import Image from "next/image";
import CallToAction from "@/components/call-to-action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NutritionFactsSection from "@/features/recipes/components/nutrition-facts-section";

interface Props {
  username: string;
  recipeSlug: string;
}

export default function RecipeDetailsView({ username, recipeSlug }: Props) {
  const { data } = useGetRecipe(username, recipeSlug);

  const recipe = data.recipes;
  const user = data.users;
  const ingredients = data.ingredients;
  const instructions = data.instructions;
  const nutrition = data.nutrition;
  const tags = data.tags;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{recipe.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title + Call to Action */}
      <div className="w-full flex items-center justify-between">
        <TitleInfoHeader
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
        <CallToAction
          type="recipe"
          recipeId={recipe.id}
          username={username}
          slug={recipeSlug}
        />
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
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <NutritionFactsSection
            nutrition={nutrition}
            className="w-full rounded-lg p-6"
          />

          <ContactSection />
        </div>

        <TagsSection tags={tags} />
      </div>
    </div>
  );
}
