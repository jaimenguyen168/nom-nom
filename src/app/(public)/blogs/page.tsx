import React from "react";
import BlogsView from "@/features/blogs/views/blogs-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  prefetch(trpc.blogs.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <BlogsView />
    </HydrateClient>
  );
}
