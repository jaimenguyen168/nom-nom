import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import SavedBlogsView from "@/features/blogs/views/saved-blogs-view";
import BlogDetailsView from "@/features/blogs/views/blog-details-view";

export default async function SavedBlogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ blogSlug?: string }>;
}) {
  const { username } = await params;
  const { blogSlug } = await searchParams;

  if (blogSlug) {
    prefetch(trpc.blogs.getBySlug.queryOptions({ slug: blogSlug }));

    return (
      <HydrateClient>
        <BlogDetailsView blogSlug={blogSlug} />
      </HydrateClient>
    );
  }

  prefetch(trpc.blogs.getSavedByUser.queryOptions({}));

  return (
    <HydrateClient>
      <SavedBlogsView username={username} />
    </HydrateClient>
  );
}
