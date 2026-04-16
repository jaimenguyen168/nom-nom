import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import EditBlogView from "@/features/blogs/views/edit-blog-view";

export default async function EditBlogPage({
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
      <EditBlogView username={username} blogSlug={blogSlug} />
    </HydrateClient>
  );
}
