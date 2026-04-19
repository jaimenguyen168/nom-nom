"use client";

import React, { useState } from "react";
import { useGetSavedBlogs } from "@/hooks/trpcHooks/use-blogs";
import BlogCard from "@/features/blogs/components/blog-card";
import AppPagination from "@/components/app-pagination";
import { PAGE_SIZE } from "@/features/blogs/constants";

const SavedBlogsView = ({ username }: { username: string }) => {
  const [page, setPage] = useState(1);
  const { data } = useGetSavedBlogs(PAGE_SIZE, page);
  const blogs = data?.items ?? [];

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-bold">Saved Blogs</h1>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No saved blogs yet
          </h3>
          <p className="text-gray-500">
            Save blogs you love and they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              href={`/${username}/blogs/saved?blogSlug=${blog.slug}`}
            />
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

export default SavedBlogsView;
