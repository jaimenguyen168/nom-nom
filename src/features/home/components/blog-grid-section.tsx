"use client";

import React from "react";
import BlogCard from "@/features/blogs/components/blog-card";
import { useGetBlogs } from "@/hooks/trpcHooks/use-blogs";
import { useRouter } from "next/navigation";

const BlogGridSection = () => {
  const router = useRouter();
  const { data } = useGetBlogs("new", 4, 1);
  const blogs = data?.items ?? [];

  if (blogs.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <button
          onClick={() => router.push("/blogs")}
          className="text-primary-200 font-medium cursor-pointer hover:text-primary-200/80"
        >
          View more
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogGridSection;
