"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  recipeCount: number;
  blogCount: number;
  cookbookCount: number;
}

export function UserProfileHeader({
  username,
  firstName,
  lastName,
  bio,
  profileImageUrl,
  recipeCount,
  blogCount,
  cookbookCount,
}: Props) {
  const displayName = [firstName, lastName].filter(Boolean).join(" ");

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
      <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
        {/* Username + display name */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{username}</h1>
          {displayName && (
            <p className="text-sm text-gray-500 mt-0.5">{displayName}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex justify-center sm:justify-start divide-x divide-gray-200">
          <StatPill value={recipeCount} label="Recipes" />
          <StatPill value={blogCount} label="Blogs" />
          <StatPill value={cookbookCount} label="Cookbooks" />
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">{bio}</p>
        )}
      </div>
    </div>
  );
}

function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-6 first:pl-0 last:pr-0">
      <span className="text-xl font-bold text-gray-900">{value}</span>
      <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">
        {label}
      </span>
    </div>
  );
}
