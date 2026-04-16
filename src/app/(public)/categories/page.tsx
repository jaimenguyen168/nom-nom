import React from "react";
import CategoriesView from "@/features/categories/views/categories-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  prefetch(trpc.categories.getCategories.queryOptions());

  return (
    <HydrateClient>
      <CategoriesView />
    </HydrateClient>
  );
}
