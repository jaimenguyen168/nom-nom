import React from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import UserProfileView from "@/features/users/views/user-profile-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  prefetch(trpc.users.getByUsername.queryOptions({ username }));
  prefetch(
    trpc.recipes.getManyPublicByUsername.queryOptions({
      username,
      page: 1,
      pageSize: 12,
    }),
  );
  prefetch(
    trpc.blogs.getManyPublicByUsername.queryOptions({
      username,
      page: 1,
      pageSize: 12,
    }),
  );
  prefetch(
    trpc.cookbooks.getManyPublicByUsername.queryOptions({
      username,
      page: 1,
      pageSize: 12,
    }),
  );

  return (
    <HydrateClient>
      <UserProfileView username={username} />
    </HydrateClient>
  );
}
