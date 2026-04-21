"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";
import { useRouter } from "next/navigation";
import { useGetMyCookbooks } from "@/hooks/trpcHooks/use-cookbooks";
import AppPagination from "@/components/app-pagination";
import { CookbookCard } from "@/features/cookbooks/components/cookbook-card";

const PAGE_SIZE = 12;

const UserCookbooksView = ({ username }: { username: string }) => {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data } = useGetMyCookbooks("all", page, PAGE_SIZE);

  const cookbooks = data?.items ?? [];

  useEffect(() => {
    if (!isLoading && currentUser?.username !== username) {
      router.replace("/recipes");
    }
  }, [currentUser?.username, username, router, isLoading]);

  if (currentUser?.username !== username) return null;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Cookbooks</h1>
          <Link href={`/${username}/cookbooks/new`}>
            <PlusCircle className="size-7 text-primary-200 cursor-pointer hover:text-primary-200/80" />
          </Link>
        </div>
      </div>

      {cookbooks.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cookbooks yet
          </h3>
          <p className="text-gray-500 mb-4">
            Curate your favorite recipes into a cookbook.
          </p>
          <Link href={`/${username}/cookbooks/new`}>
            <span className="text-primary-200 font-medium hover:text-primary-200/80">
              Create a cookbook →
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cookbooks.map((cookbook, index) => (

              <CookbookCard
                key={cookbook.id}
                cookbook={cookbook}
                index={index}
                href={`/${username}/cookbooks?cookbookSlug=${cookbook.slug}`}
              />

          ))}
        </div>
      )}

      {(data?.totalPages ?? 1) > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default UserCookbooksView;
