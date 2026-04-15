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

interface TitleInfoHeaderProps {
  title: string;
  authorId: string;
  authorName: string;
  authorProfileImageUrl?: string;
  date: string;
  commentsCount: number;
  rating: number;
  ratingCount: number;
  className?: string;
  recipeId: string;
}

const TitleInfoHeader = ({
  title,
  authorId,
  authorName,
  authorProfileImageUrl,
  date,
  commentsCount,
  rating,
  ratingCount,
  recipeId,
}: TitleInfoHeaderProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { data: saveData } = useIsSavedRecipe(recipeId);
  const { data: savesData } = useSavesCount(recipeId);

  const isSaved = saveData?.isSaved ?? false;
  const savesCount = savesData?.savesCount ?? 0;

  const handleGoToAuthor = () => {
    const targetUrl = user?.id === authorId ? "/profile" : `/users/${authorId}`;
    router.push(targetUrl);
  };

  return (
    <div>
      <AppTitle title={title} className="mb-2" />

      <div className="flex flex-wrap items-center text-sm font-semibold gap-4 mb-6">
        <div
          onClick={handleGoToAuthor}
          className="flex items-center gap-1.5 cursor-pointer hover:brightness-80"
        >
          {authorProfileImageUrl ? (
            <Image
              src={authorProfileImageUrl}
              alt={authorName}
              width={100}
              height={100}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="size-4 text-primary-200" />
          )}
          <span>{authorName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-4 text-primary-200" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircleMore className="size-4 text-primary-200" />
          <span>{commentsCount}</span>
          {commentsCount === 1 ? "Comment" : "Comments"}
        </div>
        <div className="flex items-center gap-1">
          <BookmarkIcon
            className="size-4 text-primary-200"
            fill={isSaved ? "currentColor" : "none"}
          />
          <span>{savesCount}</span> {savesCount === 1 ? "Save" : "Saves"}
        </div>
        <div className="flex items-center gap-1">
          <StarRatings rating={rating} />
          <span>
            {Number(rating).toFixed(1)} / {ratingCount}
          </span>
          {ratingCount === 1 ? "Review" : "Reviews"}
        </div>
      </div>
    </div>
  );
};

export default TitleInfoHeader;
