import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import EditCookbookView from "@/features/cookbooks/views/edit-cookbook-view";

export default async function EditCookbookPage({
  params,
}: {
  params: Promise<{ username: string; cookbookSlug: string }>;
}) {
  const { username, cookbookSlug } = await params;

  prefetch(
    trpc.cookbooks.getByUsernameAndSlug.queryOptions({
      username,
      slug: cookbookSlug,
    }),
  );

  return (
    <HydrateClient>
      <EditCookbookView username={username} cookbookSlug={cookbookSlug} />
    </HydrateClient>
  );
}
