"use client";

import React from "react";
import { useGetRecipe } from "@/hooks/trpcHooks/use-recipes";

interface Props {
  username: string;
  recipeSlug: string;
}

export default function RecipeDetailsView({ username, recipeSlug }: Props) {
  const { data } = useGetRecipe(username, recipeSlug);

  return (
    <div>
      <h1>{data.recipes.title}</h1>
      <p>{data.recipes.description}</p>
    </div>
  );
}
