"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BlogSortType, useGetBlogs } from "@/hooks/trpcHooks/use-blogs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import BlogCard from "@/features/blogs/components/blog-card";
import AppPagination from "@/components/app-pagination";
import { PAGE_SIZE } from "@/features/blogs/constants";

const BlogsView = () => {
  const { userId } = useAuth();
  const [sortBy, setSortBy] = useState<BlogSortType>("new");
  const [page, setPage] = useState(1);

  const { data } = useGetBlogs(sortBy, PAGE_SIZE, page);

  const blogs = data?.items ?? [];

  const [featuredBlog, ...remainingBlogs] = blogs;

  const handleSortChange = (value: BlogSortType) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blogs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Blogs</h1>
          {userId && (
            <Link href="/blogs/new">
              <PlusCircle className="size-7 text-primary-200 cursor-pointer hover:text-primary-200/80" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="a_z">A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-500">Check back later for new posts.</p>
        </div>
      ) : (
        <>
          {/* Featured Blog */}
          {featuredBlog && page === 1 && (
            <BlogCard blog={featuredBlog} size="large" />
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {(page === 1 ? remainingBlogs : blogs).map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </>
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

export default BlogsView;
