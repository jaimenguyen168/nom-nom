"use client";

import React, { useState } from "react";
import { useGetSavedCookbooks } from "@/hooks/trpcHooks/use-cookbooks";
import AppPagination from "@/components/app-pagination";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChefHat } from "lucide-react";

const PAGE_SIZE = 12;

const SPINE_COLORS = [
  "#1a1a2e",
  "#2d3561",
  "#1b4332",
  "#3d0c02",
  "#2c2c54",
  "#1a1a1a",
];

const SavedCookbooksView = ({ username }: { username: string }) => {
  const [page, setPage] = useState(1);
  const { data } = useGetSavedCookbooks(PAGE_SIZE, page);
  const cookbooks = data?.items ?? [];

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-bold">Saved Cookbooks</h1>

      {cookbooks.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No saved cookbooks yet
          </h3>
          <p className="text-gray-500">
            Save cookbooks you love and they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cookbooks.map((cookbook, index) => {
            const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];
            return (
              <Link
                key={cookbook.id}
                href={`/${username}/cookbooks/saved?cookbookSlug=${cookbook.slug}`}
              >
                <div className="group cursor-pointer flex flex-col gap-3">
                  <div
                    className="relative h-72 flex"
                    style={{
                      filter: "drop-shadow(6px 8px 16px rgba(0,0,0,0.35))",
                    }}
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
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
                      {/* Bottom text */}
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <p className="text-white/50 text-[10px] font-medium tracking-widest uppercase mb-0.5">
                          {cookbook.username ?? ""}
                        </p>
                        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                          {cookbook.title}
                        </h3>
                      </div>
                    </div>
                  </div>
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
          })}
        </div>
      )}

      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default SavedCookbooksView;
