"use client";

import React from "react";
import { useGetPublicBlogsByUsername } from "@/hooks/trpcHooks/use-blogs";
import BlogCard from "@/features/blogs/components/blog-card";
import AppPagination from "@/components/app-pagination";
import { NotebookPen } from "lucide-react";
import { UserEmptyState } from "./user-empty-state";

interface Props {
  username: string;
  page: number;
  onPageChange: (p: number) => void;
}

export function UserBlogsTab({ username, page, onPageChange }: Props) {
  const { data } = useGetPublicBlogsByUsername(username, page);
  const items = data?.items ?? [];

  if (items.length === 0)
    return (
      <UserEmptyState
        icon={<NotebookPen className="size-9 text-gray-200" />}
        message="No published blogs yet."
      />
    );

  return (
    <div className="space-y-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
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
