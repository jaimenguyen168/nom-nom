"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserBlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    status: "draft" | "published" | "archived" | null;
    createdAt: Date | null;
    username: string | null;
  };
}

const statusColor = (status: string | null) => {
  if (status === "published")
    return "bg-green-100 text-green-700 border-green-200";
  if (status === "draft")
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (status === "archived") return "bg-gray-100 text-gray-500 border-gray-200";
  return "";
};

const UserBlogCard = ({ blog }: UserBlogCardProps) => {
  const router = useRouter();

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleView = () => {
    router.push(`/blogs/${blog.username}?blogSlug=${blog.slug}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/blogs/${blog.username}/${blog.slug}/edit`);
  };

  return (
    <Card
      onClick={handleView}
      className={`overflow-hidden py-0 transition-all duration-300 ${
        blog.status === "published"
          ? "cursor-pointer hover:shadow-lg hover:scale-105"
          : "cursor-default"
      }`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={blog.featuredImage || "/no-image.svg"}
          alt={blog.title}
          fill
          className="object-cover"
        />
        <Badge
          className={`absolute top-3 left-3 capitalize text-xs ${statusColor(blog.status)}`}
        >
          {blog.status}
        </Badge>
      </div>
      <CardContent className="pb-4 space-y-2">
        <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        <h3 className="text-base font-bold text-gray-900 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="gap-1.5 text-primary-200 border-primary-200 hover:bg-primary-50"
          >
            <PencilIcon className="size-3.5" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBlogCard;
