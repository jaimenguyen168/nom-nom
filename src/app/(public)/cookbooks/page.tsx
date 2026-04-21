import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import CookbooksView from "@/features/cookbooks/views/cookbooks-view";

export const dynamic = "force-dynamic";

export default async function CookbooksPage() {
  prefetch(trpc.cookbooks.getMany.queryOptions({ pageSize: 12, page: 1 }));

  return (
    <HydrateClient>
      <CookbooksView />
    </HydrateClient>
  );
}
