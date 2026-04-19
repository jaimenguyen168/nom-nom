"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X, ChefHat, BookOpen, Tag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useSearchRecipes,
  useSearchBlogs,
  useSearchCategories,
  useSearchUsers,
} from "@/hooks/trpcHooks/use-search";

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ isOpen, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: recipes } = useSearchRecipes(query);
  const { data: blogs } = useSearchBlogs(query);
  const { data: cats } = useSearchCategories(query);
  const { data: foundUsers } = useSearchUsers(query);

  const hasResults =
    (recipes?.length ?? 0) > 0 ||
    (blogs?.length ?? 0) > 0 ||
    (cats?.length ?? 0) > 0 ||
    (foundUsers?.length ?? 0) > 0;

  const showDropdown = isOpen && query.length > 1;

  const handleClose = () => {
    onOpenChange(false);
    // setQuery("");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    handleClose();
  };

  return (
    <div className={isOpen ? "relative flex-1 min-w-0" : "relative shrink-0"}>
      {/* Only render the icon when closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(true)}
          aria-label="Search"
          className="py-6 rounded-full text-gray-500 hover:text-primary-200 hover:bg-transparent"
        >
          <SearchIcon className="size-6" />
        </Button>
      )}

      {/* Input — scale from right to left using origin-right */}
      {isOpen && (
        <div className="animate-in zoom-in-x-95 duration-200 origin-right w-full">
          <div className="relative w-full min-w-56">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && handleClose()}
              placeholder="Search recipes, blogs, users..."
              className="w-full pl-4 pr-9 rounded-full text-sm bg-white shadow-sm border-gray-200 focus-visible:ring-primary-200 focus-visible:ring-1"
            />
            <button
              onClick={() => handleClose()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div className="absolute top-12 right-0 w-full min-w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {!hasResults ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {(recipes?.length ?? 0) > 0 && (
                <SearchSection
                  title="Recipes"
                  icon={<ChefHat className="size-3.5" />}
                >
                  {recipes!.map((r) => (
                    <SearchItem
                      key={r.id}
                      image={r.imageUrl}
                      title={r.title}
                      subtitle={`by ${r.username}`}
                      onClick={() => handleNavigate(`/recipes/${r.slug}`)}
                    />
                  ))}
                </SearchSection>
              )}

              {(blogs?.length ?? 0) > 0 && (
                <SearchSection
                  title="Blogs"
                  icon={<BookOpen className="size-3.5" />}
                >
                  {blogs!.map((b) => (
                    <SearchItem
                      key={b.id}
                      image={b.featuredImage}
                      title={b.title}
                      subtitle={`by ${b.username}`}
                      onClick={() => handleNavigate(`/blogs/${b.slug}`)}
                    />
                  ))}
                </SearchSection>
              )}

              {(cats?.length ?? 0) > 0 && (
                <SearchSection
                  title="Categories"
                  icon={<Tag className="size-3.5" />}
                >
                  {cats!.map((c) => (
                    <SearchItem
                      key={c.id}
                      image={c.imageUrl}
                      title={c.name}
                      onClick={() =>
                        handleNavigate(
                          `/categories/${c.key}?categoryName=${c.name}`,
                        )
                      }
                    />
                  ))}
                </SearchSection>
              )}

              {(foundUsers?.length ?? 0) > 0 && (
                <SearchSection
                  title="Users"
                  icon={<User className="size-3.5" />}
                >
                  {foundUsers!.map((u) => (
                    <SearchItem
                      key={u.id}
                      image={u.profileImageUrl}
                      title={u.username ?? ""}
                      subtitle={`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()}
                      onClick={() => handleNavigate(`/${u.username}`)}
                    />
                  ))}
                </SearchSection>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDialog;

const SearchSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const SearchItem = ({
  image,
  title,
  subtitle,
  onClick,
}: {
  image?: string | null;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 transition-colors text-left"
  >
    <div className="size-8 rounded-md overflow-hidden shrink-0 bg-gray-100">
      {image ? (
        <Image
          src={image}
          alt={title}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
    </div>
  </button>
);
