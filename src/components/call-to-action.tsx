"use client";

import React from "react";
import { BookmarkIcon, PrinterIcon, Share2Icon } from "lucide-react";
import {
  useIsSavedRecipe,
  useToggleSaveRecipe,
} from "@/hooks/trpcHooks/use-recipes";

interface BaseCallToActionProps {
  username: string;
  slug: string;
  className?: string;
}

interface RecipeCallToActionProps extends BaseCallToActionProps {
  type: "recipe";
  recipeId: string;
}

type CallToActionProps = RecipeCallToActionProps;

const CallToAction = (props: CallToActionProps) => {
  const { data } = useIsSavedRecipe(props.recipeId);
  const { handleToggleSave, isPending } = useToggleSaveRecipe(
    props.recipeId,
    props.username,
    props.slug,
  );

  console.log("Saved", data?.isSaved);

  return (
    <div className="flex items-center gap-6 mr-2 text-primary-200">
      <button
        className="cursor-pointer"
        disabled={isPending}
        onClick={handleToggleSave}
      >
        <BookmarkIcon fill={data?.isSaved ? "currentColor" : "none"} />
      </button>
      <Share2Icon className="cursor-pointer" />
      <PrinterIcon className="cursor-pointer" />
    </div>
  );
};

export default CallToAction;
