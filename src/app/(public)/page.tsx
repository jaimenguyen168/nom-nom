import React from "react";
import HomeView from "@/features/home/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  prefetch(
    trpc.recipes.getMany.queryOptions({
      sortBy: "trending",
      pageSize: 6,
      page: 1,
    }),
  );
  prefetch(
    trpc.recipes.getMany.queryOptions({ sortBy: "new", pageSize: 6, page: 1 }),
  );
  prefetch(
    trpc.blogs.getMany.queryOptions({ sortBy: "new", pageSize: 4, page: 1 }),
  );
  prefetch(trpc.categories.getCategories.queryOptions());
  prefetch(trpc.cookbooks.getMany.queryOptions({ page: 1, pageSize: 5 }));

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
}
