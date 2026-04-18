import React from "react";
import BlogDetailsView from "@/features/blogs/views/blog-details-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ blogSlug: string }>;
}) {
  const { blogSlug } = await params;

  prefetch(trpc.blogs.getBySlug.queryOptions({ slug: blogSlug }));

  return (
    <HydrateClient>
      <BlogDetailsView blogSlug={blogSlug} />
    </HydrateClient>
  );
}
