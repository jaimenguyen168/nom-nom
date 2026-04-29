import React from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import UsersView from "@/features/users/views/users-view";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  prefetch(
    trpc.users.getMany.queryOptions({
      sortBy: "newest",
      page: 1,
      pageSize: 16,
    }),
  );

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
}
