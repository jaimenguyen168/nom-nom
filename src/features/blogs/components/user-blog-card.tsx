"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBlog } from "@/hooks/trpcHooks/use-blogs";
import { toast } from "sonner";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteBlog = useDeleteBlog();

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleView = () => {
    router.push(`/${blog.username}/blogs?blogSlug=${blog.slug}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${blog.username}/blogs/${blog.slug}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteBlog.mutateAsync({ blogId: blog.id });
    toast.success("Blog deleted successfully");
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        onClick={handleView}
        className={`overflow-hidden py-0 transition-all duration-300 ${
          blog.status === "published"
            ? "cursor-pointer hover:shadow-lg"
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
          <div className="flex justify-end gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleEdit}
              className="gap-1.5 bg-primary-200 border-primary-200 hover:bg-primary-300"
            >
              <PencilIcon className="size-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteClick}
              className="gap-1.5 text-primary-200 border-primary-200 hover:border-primary-300 hover:text-primary-300"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{blog.title}</span>?
              This will permanently remove the blog along with all its comments,
              reviews, tags, and saves. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteBlog.isPending}
              className="bg-primary-200 hover:bg-primary-300! text-white"
            >
              {deleteBlog.isPending ? "Deleting..." : "Delete Blog"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserBlogCard;
