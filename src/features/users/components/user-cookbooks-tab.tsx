"use client";

import React from "react";
import { useGetPublicCookbooksByUsername } from "@/hooks/trpcHooks/use-cookbooks";
import { CookbookCard } from "@/features/cookbooks/components/cookbook-card";
import AppPagination from "@/components/app-pagination";
import { ChefHat } from "lucide-react";
import { UserEmptyState } from "./user-empty-state";

interface Props {
  username: string;
  page: number;
  onPageChange: (p: number) => void;
}

export function UserCookbooksTab({ username, page, onPageChange }: Props) {
  const { data } = useGetPublicCookbooksByUsername(username, page);
  const items = data?.items ?? [];

  if (items.length === 0)
    return (
      <UserEmptyState
        icon={<ChefHat className="size-9 text-gray-200" />}
        message="No published cookbooks yet."
      />
    );

  return (
    <div className="space-y-8 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((cookbook, index) => (
          <CookbookCard
            key={cookbook.id}
            cookbook={cookbook}
            index={index}
            href={`/cookbooks/${cookbook.slug}`}
          />
        ))}
      </div>
      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
