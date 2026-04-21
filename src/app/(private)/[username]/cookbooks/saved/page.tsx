import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import SavedCookbooksView from "@/features/cookbooks/views/saved-cookbooks-view";
import CookbookDetailsView from "@/features/cookbooks/views/cookbook-details-view";

export default async function SavedCookbooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ cookbookSlug?: string }>;
}) {
  const { username } = await params;
  const { cookbookSlug } = await searchParams;

  if (cookbookSlug) {
    prefetch(trpc.cookbooks.getBySlug.queryOptions({ slug: cookbookSlug }));

    return (
      <HydrateClient>
        <CookbookDetailsView slug={cookbookSlug} />
      </HydrateClient>
    );
  }

  prefetch(trpc.cookbooks.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <SavedCookbooksView username={username} />
    </HydrateClient>
  );
}
