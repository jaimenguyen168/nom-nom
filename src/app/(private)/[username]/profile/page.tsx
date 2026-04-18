import React from "react";
import ProfileView from "@/features/profile/views/profile-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  prefetch(trpc.users.getCurrentUser.queryOptions());

  return (
    <HydrateClient>
      <ProfileView />
    </HydrateClient>
  );
}
