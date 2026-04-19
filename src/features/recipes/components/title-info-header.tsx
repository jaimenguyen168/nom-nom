"use client";

import React from "react";
import {
  BookmarkIcon,
  CalendarDays,
  MessageCircleMore,
  UserCircleIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import StarRatings from "@/components/star-ratings";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AppTitle from "@/components/app-title";
import { useIsSavedRecipe, useSavesCount } from "@/hooks/trpcHooks/use-recipes";
import { useIsSavedBlog, useBlogSavesCount } from "@/hooks/trpcHooks/use-blogs";

interface BaseProps {
  title: string;
  authorId: string;
  authorName: string;
  authorProfileImageUrl?: string;
  date: string;
  commentsCount: number;
  rating: number;
  ratingCount: number;
  className?: string;
}

interface RecipeProps extends BaseProps {
  type: "recipe";
  recipeId: string;
}

interface BlogProps extends BaseProps {
  type: "blog";
  blogId: string;
}

type TitleInfoHeaderProps = RecipeProps | BlogProps;

const TitleInfoHeader = (props: TitleInfoHeaderProps) => {
  const { user } = useUser();
  const router = useRouter();

  const recipeId = props.type === "recipe" ? props.recipeId : "";
  const blogId = props.type === "blog" ? props.blogId : "";

  const { data: recipeSaveData, isLoading: recipeIsLoading } =
    useIsSavedRecipe(recipeId);
  const { data: recipeSavesData, isLoading: recipeSavesLoading } =
    useSavesCount(recipeId);
  const { data: blogSaveData, isLoading: blogSaveLoading } =
    useIsSavedBlog(blogId);
  const { data: blogSavesData, isLoading: blogSavesLoading } =
    useBlogSavesCount(blogId);

  const isSaved =
    props.type === "recipe"
      ? (recipeSaveData?.isSaved ?? false)
      : (blogSaveData?.isSaved ?? false);

  const savesCount =
    props.type === "recipe"
      ? (recipeSavesData?.savesCount ?? 0)
      : (blogSavesData?.savesCount ?? 0);

  const savesLoading =
    props.type === "recipe"
      ? recipeIsLoading || recipeSavesLoading
      : blogSaveLoading || blogSavesLoading;

  const handleGoToAuthor = () => {
    const targetUrl =
      user?.id === props.authorId
        ? `/${props.authorName}/profile`
        : `/${props.authorName}`;
    router.push(targetUrl);
  };

  return (
    <div>
      <AppTitle title={props.title} className="mb-2" />
      <div className="flex flex-wrap items-center text-sm font-semibold gap-4 mb-6">
        <div
          onClick={handleGoToAuthor}
          className="flex items-center gap-1.5 cursor-pointer hover:brightness-80"
        >
          {props.authorProfileImageUrl ? (
            <Image
              src={props.authorProfileImageUrl}
              alt={props.authorName}
              width={100}
              height={100}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="size-4 text-primary-200" />
          )}
          <span>{props.authorName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-4 text-primary-200" />
          <span>{formatDate(props.date)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MessageCircleMore className="size-4 text-primary-200" />
          <span>{props.commentsCount}</span>
          {props.commentsCount === 1 ? "Comment" : "Comments"}
        </div>

        <div className="flex items-center gap-1">
          <BookmarkIcon
            className="size-4 text-primary-200"
            fill={isSaved ? "currentColor" : "none"}
          />
          {savesLoading ? (
            <span className="w-8 h-4 bg-gray-200 rounded animate-pulse inline-block" />
          ) : (
            <>
              <span>{savesCount}</span>
              {savesCount === 1 ? "Save" : "Saves"}
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <StarRatings rating={props.rating} />
          {props.ratingCount === 0 ? (
            <span className="text-gray-400">No reviews yet</span>
          ) : (
            <>
              <span>
                {Number(props.rating).toFixed(1)} / {props.ratingCount}
              </span>
              {props.ratingCount === 1 ? "Review" : "Reviews"}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleInfoHeader;
