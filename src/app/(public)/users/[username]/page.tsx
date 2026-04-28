import React, { Suspense } from "react";
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
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileView username={username} />
      </Suspense>
    </HydrateClient>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 py-6">
        <div className="size-32 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-6 w-10 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
