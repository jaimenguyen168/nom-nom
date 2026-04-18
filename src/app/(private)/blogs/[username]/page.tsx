import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import UserBlogsView from "@/features/blogs/views/user-blogs-view";
import BlogDetailsView from "@/features/blogs/views/blog-details-view";

export default async function UserBlogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ blogSlug?: string }>;
}) {
  const { username } = await params;
  const { blogSlug } = await searchParams;

  if (blogSlug) {
    prefetch(
      trpc.blogs.getByUsernameAndSlug.queryOptions({
        username,
        slug: blogSlug,
      }),
    );

    return (
      <HydrateClient>
        <BlogDetailsView username={username} blogSlug={blogSlug} fromMyBlogs />
      </HydrateClient>
    );
  }

  prefetch(trpc.blogs.getManyByUser.queryOptions({}));

  return (
    <HydrateClient>
      <UserBlogsView username={username} />
    </HydrateClient>
  );
}
