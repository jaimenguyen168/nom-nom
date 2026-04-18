import React from "react";
import CreateRecipeView from "@/features/recipes/views/create-recipe-view";
import CreateRecipeWithAgentView from "@/features/recipes/views/create-recipe-with-agent-view";

export default async function CreateRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;

  if (agent === "true") {
    return <CreateRecipeWithAgentView />;
  }

  return <CreateRecipeView />;
}
