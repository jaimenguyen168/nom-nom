"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    topic: string | null;
    createdAt: Date | null;
    username: string | null;
    profileImageUrl: string | null;
    authorId: string;
  };
  size?: "large" | "medium";
}

const BlogCard = ({ blog, size = "medium" }: BlogCardProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/blogs/${blog.slug}`);
  };

  const handleGoToAuthor = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${blog.username}`);
  };

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (size === "large") {
    return (
      <Card className="relative w-full mb-12 overflow-hidden py-0">
        <div className="relative h-96 w-full">
          <Image
            src={blog.featuredImage || "/no-image.svg"}
            alt={blog.title}
            fill
            sizes="100vw"
            className="object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <CardContent className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-2xl">
              <p className="text-sm text-gray-100 mb-3">{formattedDate}</p>
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                {blog.title}
              </h2>
              <p className="text-gray-100 mb-6 line-clamp-3">{blog.excerpt}</p>
              <Button
                variant="secondary"
                className="bg-primary-200 hover:bg-primary-300 text-white border-0"
                onClick={handleNavigation}
              >
                Read more →
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onClick={handleNavigation}
      className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 py-0 hover:scale-105 cursor-pointer"
    >
      <div className="relative h-48 w-full">
        <Image
          src={blog.featuredImage || "/no-image.svg"}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardContent className="pb-6 space-y-2">
        <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-primary-200 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
        <div
          className="flex items-center gap-2 pt-2 cursor-pointer hover:opacity-80"
          onClick={handleGoToAuthor}
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={blog.profileImageUrl ?? ""} />
            <AvatarFallback>{blog.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{blog.username}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
