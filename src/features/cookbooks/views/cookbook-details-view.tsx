"use client";

import React, { useState } from "react";
import { useGetCookbookBySlug } from "@/hooks/trpcHooks/use-cookbooks";
import { useGetRecipeBySlug } from "@/hooks/trpcHooks/use-recipes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Star,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PrepInfo from "@/features/recipes/components/prep-info";
import IngredientsInfo from "@/features/recipes/components/ingredients-info";
import InstructionsInfo from "@/features/recipes/components/instructions-info";
import NutritionFactsSection from "@/features/recipes/components/nutrition-facts-section";
import TagsSection from "@/components/tags-section";

interface Props {
  slug: string;
}

export default function CookbookDetailsView({ slug }: Props) {
  const { data: cookbook } = useGetCookbookBySlug(slug);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const router = useRouter();

  const recipes = cookbook.recipes ?? [];
  const activeRecipe = recipes[activeRecipeIndex];

  type CookbookRecipe = (typeof recipes)[number] & { index: number };

  const chapters = recipes.reduce(
    (acc, recipe, index) => {
      const chapter = recipe.chapterTitle ?? "Recipes";
      if (!acc[chapter]) acc[chapter] = [] as CookbookRecipe[];
      acc[chapter].push({ ...recipe, index });
      return acc;
    },
    {} as Record<string, CookbookRecipe[]>,
  );

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div className="relative w-full h-84 lg:h-125 mb-10 overflow-hidden rounded-3xl">
        <Image
          src={cookbook.coverImageUrl ?? "/no-image.svg"}
          alt={cookbook.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          {cookbook.edition && (
            <p className="text-xs text-white/60 uppercase tracking-widest mb-2">
              {cookbook.edition}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
            {cookbook.title}
          </h1>
          <p className="text-white/70 mb-4">by {cookbook.username}</p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {cookbook.isFree ? (
              <Badge className="bg-green-500/80 text-white border-0 px-3 py-1">
                Free
              </Badge>
            ) : (
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                {cookbook.currency} {cookbook.price}
              </Badge>
            )}
            {cookbook.difficulty && (
              <Badge className="bg-white/20 text-white border-white/30 capitalize px-3 py-1">
                {cookbook.difficulty}
              </Badge>
            )}
            {cookbook.language && cookbook.language !== "English" && (
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                {cookbook.language}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary-200" />
              {recipes.length} {recipes.length === 1 ? "Recipe" : "Recipes"}
            </span>
            {cookbook.cuisine && (
              <span className="flex items-center gap-1.5">
                <ChefHat className="size-4 text-primary-200" />
                {cookbook.cuisine}
              </span>
            )}
            {cookbook.servingsRange && (
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-primary-200" />
                Serves {cookbook.servingsRange}
              </span>
            )}
            {cookbook.avgRating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-primary-200 text-primary-200" />
                {cookbook.avgRating.toFixed(1)} ({cookbook.totalReviews}{" "}
                {cookbook.totalReviews === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Description + Tags ── */}
      {(cookbook.description ||
        (cookbook.tags && cookbook.tags.length > 0)) && (
        <div className="mb-10 space-y-3">
          {cookbook.description && (
            <p className="text-gray-600 leading-relaxed max-w-2xl">
              {cookbook.description}
            </p>
          )}
          {cookbook.tags && cookbook.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cookbook.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <Separator className="mb-10" />

      {/* ── Content ── */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No recipes in this cookbook yet.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Table of Contents
              </p>
              <div className="space-y-3">
                {Object.entries(chapters).map(([chapter, chapterRecipes]) => (
                  <div key={chapter} className="space-y-1">
                    {Object.keys(chapters).length > 1 && (
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
                        {chapter}
                      </p>
                    )}
                    {chapterRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => setActiveRecipeIndex(recipe.index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm",
                          activeRecipeIndex === recipe.index
                            ? "bg-primary-200 text-white shadow-sm"
                            : "hover:bg-gray-100 text-gray-600",
                        )}
                      >
                        <div className="relative size-8 rounded-md overflow-hidden shrink-0 bg-gray-200">
                          {recipe.imageUrl && (
                            <Image
                              src={recipe.imageUrl}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="truncate font-medium">{recipe.title}</p>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          {activeRecipe && (
            <div className="flex-1 min-w-0">
              <RecipeContent
                recipeSlug={activeRecipe.slug}
                activeIndex={activeRecipeIndex}
                total={recipes.length}
                onPrev={() => setActiveRecipeIndex((i) => Math.max(0, i - 1))}
                onNext={() =>
                  setActiveRecipeIndex((i) =>
                    Math.min(recipes.length - 1, i + 1),
                  )
                }
                onViewFull={() => router.push(`/recipes/${activeRecipe.slug}`)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecipeContent({
  recipeSlug,
  activeIndex,
  total,
  onPrev,
  onNext,
  onViewFull,
}: {
  recipeSlug: string;
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onViewFull: () => void;
}) {
  const { data } = useGetRecipeBySlug(recipeSlug);

  const recipe = data.recipes;
  const ingredients = data.ingredients;
  const instructions = data.instructions;
  const nutrition = data.nutrition;
  const tags = data.tags;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Recipe {activeIndex + 1} of {total}
          </p>
          <h2 className="text-3xl font-bold">{recipe.title}</h2>
          {recipe.description && (
            <p className="text-gray-500 mt-2 max-w-xl">{recipe.description}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewFull}
          className="shrink-0 gap-2 text-primary-200 border-primary-200 hover:bg-primary-50"
        >
          <ExternalLink className="size-4" />
          Full Recipe
        </Button>
      </div>

      <div className="relative w-full h-80 rounded-xl overflow-hidden">
        <Image
          src={recipe.imageUrl ?? "/no-image.svg"}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>

      <PrepInfo
        prepTime={recipe.prepTimeMinutes ?? 0}
        cookTime={recipe.cookTimeMinutes ?? 0}
        serving={recipe.servings ?? 1}
      />

      <Separator />

      <div className="flex flex-col gap-8">
        <IngredientsInfo ingredients={ingredients} />
        <InstructionsInfo instructions={instructions} />
      </div>

      {nutrition.length > 0 && (
        <NutritionFactsSection
          nutrition={nutrition}
          className="w-full rounded-lg p-6"
        />
      )}

      {tags.length > 0 && <TagsSection tags={tags} />}

      <Separator />

      <div className="flex items-center justify-between py-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={activeIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="size-4" /> Previous
        </Button>
        <span className="text-sm text-gray-400">
          {activeIndex + 1} / {total}
        </span>
        <Button
          onClick={onNext}
          disabled={activeIndex === total - 1}
          className="gap-2 bg-primary-200 hover:bg-primary-300 text-white"
        >
          Next <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
