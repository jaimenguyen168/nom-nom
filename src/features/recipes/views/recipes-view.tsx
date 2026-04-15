"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGetRecipes } from "@/hooks/trpcHooks/use-recipes";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import RecipeCard from "@/features/recipes/components/recipe-card";

type RecipeFeedType = "trending" | "popular" | "new" | "a_z" | "relevance";

const RecipesView = () => {
  const { userId } = useAuth();
  const [sortBy, setSortBy] = useState<RecipeFeedType>("new");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data } = useGetRecipes(sortBy, pageSize, page);

  const recipes = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;

  const handleSortChange = (value: RecipeFeedType) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recipes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Recipes</h1>
          {userId && (
            <Link href="/recipes/new">
              <PlusCircle className="size-7 text-primary-200 cursor-pointer hover:text-primary-200/80" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="a_z">A to Z</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              username={recipe.username ?? ""}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your sort or check back later.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        {page > 1 && (
          <Button variant="outline" onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
        )}
        {hasMore && (
          <Button onClick={() => setPage((p) => p + 1)}>Load more</Button>
        )}
      </div>

      {!hasMore && total > 0 && (
        <p className="text-center text-gray-500 py-8">
          You&apos;ve seen all {total} recipes!
        </p>
      )}
    </div>
  );
};

export default RecipesView;
