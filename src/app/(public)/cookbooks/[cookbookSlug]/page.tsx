import React from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import CookbookDetailsView from "@/features/cookbooks/views/cookbook-details-view";

export default async function CookbookDetailsPage({
  params,
}: {
  params: Promise<{ cookbookSlug: string }>;
}) {
  const { cookbookSlug } = await params;

  prefetch(trpc.cookbooks.getBySlug.queryOptions({ slug: cookbookSlug }));

  return (
    <HydrateClient>
      <CookbookDetailsView slug={cookbookSlug} />
    </HydrateClient>
  );
}
