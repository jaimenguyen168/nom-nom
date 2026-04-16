import React from "react";
import BlogDetailsView from "@/features/blogs/views/blog-details-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ username: string; blogSlug: string }>;
}) {
  const { username, blogSlug } = await params;

  prefetch(
    trpc.blogs.getByUsernameAndSlug.queryOptions({ username, slug: blogSlug }),
  );

  return (
    <HydrateClient>
      <BlogDetailsView username={username} blogSlug={blogSlug} />
    </HydrateClient>
  );
}
