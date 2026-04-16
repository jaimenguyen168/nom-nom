import React from "react";
import CategoryBasedView from "@/features/categories/views/category-based-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function CategoryBasedPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ categoryName?: string }>;
}) {
  const { categorySlug } = await params;
  const { categoryName } = await searchParams;

  prefetch(trpc.recipes.getManyByCategory.queryOptions({ categorySlug }));

  return (
    <HydrateClient>
      <CategoryBasedView
        categorySlug={categorySlug}
        categoryName={categoryName ?? ""}
      />
    </HydrateClient>
  );
}
