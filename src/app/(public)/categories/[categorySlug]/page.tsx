import React, { Suspense } from "react";
import CategoryBasedView from "@/features/categories/views/category-based-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Loader2 } from "lucide-react";

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
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <CategoryBasedView
          categorySlug={categorySlug}
          categoryName={categoryName ?? ""}
        />
      </Suspense>
    </HydrateClient>
  );
}
