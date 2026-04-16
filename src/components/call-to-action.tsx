"use client";

import React from "react";
import { BookmarkIcon, PrinterIcon, Share2Icon } from "lucide-react";
import {
  useIsSavedRecipe,
  useToggleSaveRecipe,
} from "@/hooks/trpcHooks/use-recipes";
import { useIsSavedBlog, useToggleSaveBlog } from "@/hooks/trpcHooks/use-blogs";

interface BaseCallToActionProps {
  username: string;
  slug: string;
  className?: string;
}

interface RecipeCallToActionProps extends BaseCallToActionProps {
  type: "recipe";
  recipeId: string;
}

interface BlogCallToActionProps extends BaseCallToActionProps {
  type: "blog";
  blogId: string;
}

type CallToActionProps = RecipeCallToActionProps | BlogCallToActionProps;

const CallToAction = (props: CallToActionProps) => {
  const recipeId = props.type === "recipe" ? props.recipeId : "";
  const blogId = props.type === "blog" ? props.blogId : "";

  const { data: recipeSaveData } = useIsSavedRecipe(recipeId);
  const { handleToggleSave: toggleRecipe, isPending: recipeIsPending } =
    useToggleSaveRecipe(recipeId, props.username, props.slug);

  const { data: blogSaveData } = useIsSavedBlog(blogId);
  const { handleToggleSave: toggleBlog, isPending: blogIsPending } =
    useToggleSaveBlog(blogId, props.username, props.slug);

  const isSaved =
    props.type === "recipe"
      ? (recipeSaveData?.isSaved ?? false)
      : (blogSaveData?.isSaved ?? false);

  const handleToggleSave = props.type === "recipe" ? toggleRecipe : toggleBlog;

  const isPending = props.type === "recipe" ? recipeIsPending : blogIsPending;

  return (
    <div className="flex items-center gap-6 mr-2 text-primary-200">
      <button
        className="cursor-pointer"
        disabled={isPending}
        onClick={handleToggleSave}
      >
        <BookmarkIcon fill={isSaved ? "currentColor" : "none"} />
      </button>
      <Share2Icon className="cursor-pointer" />
      <PrinterIcon className="cursor-pointer" />
    </div>
  );
};

export default CallToAction;
