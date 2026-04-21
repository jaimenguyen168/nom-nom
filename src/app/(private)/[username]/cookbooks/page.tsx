import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import UserCookbooksView from "@/features/cookbooks/views/user-cookbooks-view";
import CookbookDetailsView from "@/features/cookbooks/views/cookbook-details-view";

export default async function UserCookbooksPage({
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
      <UserCookbooksView username={username} />
    </HydrateClient>
  );
}
