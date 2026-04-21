"use client";

import React, { useEffect, useState } from "react";
import { BlogStatusFilter, useGetMyBlogs } from "@/hooks/trpcHooks/use-blogs";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import AppPagination from "@/components/app-pagination";
import { PAGE_SIZE } from "@/features/blogs/constants";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserBlogCard from "@/features/blogs/components/user-blog-card";

const statusFilters: { label: string; value: BlogStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const UserBlogsView = ({ username }: { username: string }) => {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const router = useRouter();
  const [status, setStatus] = useState<BlogStatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data } = useGetMyBlogs(status, PAGE_SIZE, page);
  const blogs = data?.items ?? [];

  useEffect(() => {
    if (!isLoading && currentUser?.username !== username) {
      router.replace("/blogs");
    }
  }, [currentUser?.username, username, router, isLoading]);

  if (currentUser?.username !== username) return null;

  const handleStatusChange = (value: BlogStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <Link href={`/${username}/blogs/new`}>
            <PlusCircle className="size-7 text-primary-200 cursor-pointer hover:text-primary-200/80" />
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={status === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(filter.value)}
            className={
              status === filter.value
                ? "bg-primary-200 hover:bg-primary-300"
                : ""
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start writing your first blog post.
          </p>
          <Link href="/blogs/new">
            <span className="text-primary-200 font-medium hover:text-primary-200/80">
              Create a blog →
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <UserBlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default UserBlogsView;
