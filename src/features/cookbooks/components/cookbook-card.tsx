"use client";

// ── CookbookCard ──────────────────────────────────────────────────────────────
// Reusable book-shaped card — use this everywhere (home, user cookbooks, saved)

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChefHat, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SPINE_COLORS = [
  "#1a1a2e",
  "#2d3561",
  "#1b4332",
  "#3d0c02",
  "#2c2c54",
  "#1a1a1a",
];

export type CookbookCardItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  profileImageUrl?: string | null;
  username?: string | null;
  totalRecipes?: number | null;
  isFree?: boolean | null;
  price?: string | null;
  currency?: string | null;
};

export const CookbookCard = ({
  cookbook,
  index,
  href,
}: {
  cookbook: CookbookCardItem;
  index: number;
  href: string;
}) => {
  const router = useRouter();
  const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];
  const isPaid = !cookbook.isFree;

  return (
    <Link href={href}>
      <div className="group cursor-pointer flex flex-col gap-3">
        <div
          className="relative h-72 flex"
          style={{ filter: "drop-shadow(6px 8px 16px rgba(0,0,0,0.35))" }}
        >
          {/* Spine */}
          <div
            className="w-4 shrink-0 rounded-l-sm"
            style={{
              backgroundColor: spineColor,
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Cover */}
          <div className="flex-1 relative overflow-hidden rounded-r-sm transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
            {cookbook.coverImageUrl ? (
              <>
                <Image
                  src={cookbook.coverImageUrl}
                  alt={cookbook.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: spineColor }}
              >
                <BookOpen className="size-10 text-white/20" />
              </div>
            )}

            {/* Page edge */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #f0ede8 0px, #e2ddd8 1.5px, #f0ede8 3px)",
                opacity: 0.9,
              }}
            />

            {/* Top row — author avatar + price badge */}
            <div className="absolute top-0 inset-x-0 p-3 flex items-start justify-between">
              {/* Author avatar */}
              <Avatar
                className="size-7 border border-white/30 shadow cursor-pointer hover:ring-2 hover:ring-white/60 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cookbook.username) router.push(`/users/${cookbook.username}`);
                }}
              >
                <AvatarImage
                  src={cookbook.profileImageUrl ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-black/40 text-white">
                  {cookbook.username?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              {/* Free / Paid badge */}
              {isPaid ? (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                  <Lock className="size-2.5" />
                  {cookbook.currency} {cookbook.price}
                </div>
              ) : (
                <div className="bg-green-500/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                  Free
                </div>
              )}
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-0 inset-x-0 p-3">
              <p className="text-white/50 text-[10px] font-medium tracking-widest uppercase mb-0.5 truncate">
                {cookbook.username ?? ""}
              </p>
              <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                {cookbook.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Below card */}
        {(cookbook.totalRecipes ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 px-1">
            <ChefHat className="size-3 text-gray-400" />
            <span className="text-xs text-gray-400">
              {cookbook.totalRecipes} recipes
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
