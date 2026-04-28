"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Grid3X3, NotebookPen, UserCheck, UserPlus } from "lucide-react";
import { useGetCurrentUser, useIsFollowing, useToggleFollow } from "@/hooks/trpcHooks/use-users";
import { Button } from "@/components/ui/button";

export type UserCardItem = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  recipeCount: number;
  blogCount: number;
  cookbookCount: number;
  saleCount: number;
};

export function UserCard({ user }: { user: UserCardItem }) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const { data: currentUser } = useGetCurrentUser();
  const isOwner = currentUser?.id === user.id;

  const { data: followData } = useIsFollowing(isOwner ? undefined : user.id);
  const { handleToggle, isPending } = useToggleFollow(user.id, user.username ?? "");

  const isFollowing = followData?.isFollowing ?? false;

  return (
    <Link href={`/users/${user.username}`}>
      <div className="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200 h-full gap-3 cursor-pointer">
        {/* Avatar */}
        <Avatar className="size-16 ring-1 ring-gray-100 group-hover:ring-gray-300 transition-all">
          <AvatarImage
            src={user.profileImageUrl ?? ""}
            alt={user.username ?? ""}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold bg-gray-50 text-gray-400">
            {(user.username ?? "?")?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <div className="min-w-0 w-full">
          <p className="font-semibold text-sm truncate">{user.username}</p>
          {displayName && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{displayName}</p>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Follow button */}
        {!isOwner && currentUser && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggle();
            }}
            disabled={isPending}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={
              isFollowing
                ? "w-full text-xs gap-1.5"
                : "w-full text-xs gap-1.5 bg-primary-200 hover:bg-primary-300 text-white"
            }
          >
            {isFollowing ? (
              <>
                <UserCheck className="size-3" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="size-3" />
                Follow
              </>
            )}
          </Button>
        )}

        {/* Content type icons */}
        <div className="mt-auto flex items-center justify-center gap-3 pt-3 border-t border-gray-100 w-full text-gray-300">
          {user.recipeCount > 0 && <Grid3X3 className="size-3.5" />}
          {user.blogCount > 0 && <NotebookPen className="size-3.5" />}
          {user.cookbookCount > 0 && <BookOpen className="size-3.5" />}
        </div>
      </div>
    </Link>
  );
}
