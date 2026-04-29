"use client";

import React, { useState } from "react";
import { useGetUserByUsername } from "@/hooks/trpcHooks/use-users";
import { UserProfileHeader } from "@/features/users/components/user-profile-header";
import { UserRecipesTab } from "@/features/users/components/user-recipes-tab";
import { UserBlogsTab } from "@/features/users/components/user-blogs-tab";
import { UserCookbooksTab } from "@/features/users/components/user-cookbooks-tab";
import { BookOpen, CookingPotIcon, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "recipes" | "blogs" | "cookbooks";

interface Props {
  username: string;
}

export default function UserProfileView({ username }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("recipes");
  const [recipePage, setRecipePage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [cookbookPage, setCookbookPage] = useState(1);

  const { data: user } = useGetUserByUsername(username);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "recipes",   label: "Recipes",   icon: <CookingPotIcon className="size-3.5" />, count: user.recipeCount   },
    { id: "blogs",     label: "Blogs",     icon: <NotebookPen className="size-3.5" />,    count: user.blogCount     },
    { id: "cookbooks", label: "Cookbooks", icon: <BookOpen className="size-3.5" />,       count: user.cookbookCount },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <UserProfileHeader
        userId={user.id}
        username={user.username}
        firstName={user.firstName}
        lastName={user.lastName}
        bio={user.bio}
        profileImageUrl={user.profileImageUrl}
        followerCount={user.followerCount}
        followingCount={user.followingCount}
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium tracking-widest uppercase border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300",
              )}
            >
              {tab.icon}
              {tab.label}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "recipes" && (
          <UserRecipesTab username={username} page={recipePage} onPageChange={setRecipePage} />
        )}
        {activeTab === "blogs" && (
          <UserBlogsTab username={username} page={blogPage} onPageChange={setBlogPage} />
        )}
        {activeTab === "cookbooks" && (
          <UserCookbooksTab username={username} page={cookbookPage} onPageChange={setCookbookPage} />
        )}
      </div>
    </div>
  );
}
