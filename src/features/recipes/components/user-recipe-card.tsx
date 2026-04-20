"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
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
import { useDeleteRecipe } from "@/hooks/trpcHooks/use-recipes";
import { toast } from "sonner";

interface UserRecipeCardProps {
  recipe: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    isPublic: boolean | null;
    createdAt: Date | null;
    username: string | null;
    calories: number;
  };
}

const UserRecipeCard = ({ recipe }: UserRecipeCardProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteRecipe = useDeleteRecipe();

  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleView = () => {
    router.push(`/${recipe.username}/recipes?recipeSlug=${recipe.slug}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${recipe.username}/recipes/${recipe.slug}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteRecipe.mutateAsync({ recipeId: recipe.id });
    toast.success("Recipe deleted successfully");
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        onClick={handleView}
        className="overflow-hidden py-0 cursor-pointer hover:shadow-lg"
      >
        <div className="relative h-48 w-full">
          <Image
            src={recipe.imageUrl || "/no-image.svg"}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <Badge
            className={`absolute top-3 left-3 capitalize text-xs ${
              recipe.isPublic
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {recipe.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <CardContent className="pb-4 space-y-2">
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
          <h3 className="text-base font-bold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Flame size={14} className="text-primary-200" />
              {recipe.calories} cals
            </div>
            <div className="flex items-center gap-2">
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
                className="gap-1.5 text-primary-200 border-primary-200  hover:border-primary-300 hover:text-primary-300"
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {recipe.title}
              </span>
              ? This will permanently remove the recipe along with all its
              ingredients, instructions, reviews, comments, and saves. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteRecipe.isPending}
              className="bg-primary-200 hover:bg-primary-300! text-white"
            >
              {deleteRecipe.isPending ? "Deleting..." : "Delete Recipe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserRecipeCard;
