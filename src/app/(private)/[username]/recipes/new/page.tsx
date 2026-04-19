import React from "react";
import CreateRecipeView from "@/features/recipes/views/create-recipe-view";
import CreateRecipeWithAgentView from "@/features/recipes/views/create-recipe-with-agent-view";

export default async function CreateRecipePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ agent?: string }>;
}) {
  const { username } = await params;
  const { agent } = await searchParams;

  if (agent === "true") {
    return <CreateRecipeWithAgentView username={username} />;
  }

  return <CreateRecipeView username={username} />;
}
