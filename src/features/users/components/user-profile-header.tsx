"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetCurrentUser, useIsFollowing, useToggleFollow } from "@/hooks/trpcHooks/use-users";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";

interface Props {
  userId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  followerCount: number;
  followingCount: number;
}

export function UserProfileHeader({
  userId,
  username,
  firstName,
  lastName,
  bio,
  profileImageUrl,
  followerCount,
  followingCount,
}: Props) {
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const { data: currentUser } = useGetCurrentUser();
  const isOwner = currentUser?.id === userId;

  const { data: followData } = useIsFollowing(isOwner ? undefined : userId);
  const { handleToggle, isPending } = useToggleFollow(userId, username ?? "");
  const isFollowing = followData?.isFollowing ?? false;

  return (
    <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start pt-2">
      {/* Avatar */}
      <Avatar className="size-28 sm:size-36 shrink-0 ring-1 ring-gray-200 shadow-sm">
        <AvatarFallback className="text-4xl font-semibold bg-gray-50 text-gray-400">
          {(username ?? "?")?.[0]?.toUpperCase()}
        </AvatarFallback>
        <AvatarImage
          src={profileImageUrl ?? ""}
          alt={username ?? ""}
          className="object-cover"
        />
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-5 text-center sm:text-left">
        {/* Username + display name + follow button */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{username}</h1>
            {displayName && (
              <p className="text-sm text-gray-500 mt-0.5">{displayName}</p>
            )}
          </div>
          {!isOwner && currentUser && (
            <Button
              onClick={handleToggle}
              disabled={isPending}
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              className={
                isFollowing
                  ? "gap-1.5 shrink-0"
                  : "gap-1.5 shrink-0 bg-primary-200 hover:bg-primary-300 text-white"
              }
            >
              {isFollowing ? (
                <><UserCheck className="size-3.5" /> Following</>
              ) : (
                <><UserPlus className="size-3.5" /> Follow</>
              )}
            </Button>
          )}
        </div>

        {/* Follower / Following social stats */}
        <div className="flex justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{followerCount}</span>
            Followers
          </div>
          <div className="w-px bg-gray-200 self-stretch" />
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{followingCount}</span>
            Following
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">{bio}</p>
        )}
      </div>
    </div>
  );
}

