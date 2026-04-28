"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsers, UserSortBy } from "@/hooks/trpcHooks/use-users";
import { UserCard } from "@/features/users/components/user-card";
import AppPagination from "@/components/app-pagination";

const PAGE_SIZE = 16;

export default function UsersView() {
  const [sortBy, setSortBy] = useState<UserSortBy>("newest");
  const [page, setPage] = useState(1);

  const { data } = useGetUsers(sortBy, page, PAGE_SIZE);
  const users = data?.items ?? [];

  const handleSortChange = (value: UserSortBy) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Creators</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="most_recipes">Most Recipes</SelectItem>
              <SelectItem value="most_blogs">Most Blogs</SelectItem>
              <SelectItem value="most_cookbooks">Most Cookbooks</SelectItem>
              <SelectItem value="top_selling">Top Selling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {users.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No creators found
          </h3>
          <p className="text-gray-500">Check back later.</p>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
