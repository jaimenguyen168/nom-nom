"use client";

import React from "react";
import Image from "next/image";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetBlogBySlug,
  useGetRelatedRecipeId,
} from "@/hooks/trpcHooks/use-blogs";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import TagsSection from "@/components/tags-section";
import CommentsSection from "@/features/recipes/components/comments-section";
import TitleInfoHeader from "@/features/recipes/components/title-info-header";
import CallToAction from "@/components/call-to-action";
import { Badge } from "@/components/ui/badge";
import RecipeRecommendationGrid from "@/features/recipes/components/recipe-recommendation-grid";
import BlogCategoryGrid from "@/features/blogs/components/blog-category-grid";

interface Props {
  blogSlug: string;
  fromMyBlogs?: boolean;
}

export default function BlogDetailsView({ blogSlug }: Props) {
  const { data } = useGetBlogBySlug(blogSlug);
  const { userId } = useAuth();
  const router = useRouter();

  const blog = data.blogs;
  const user = data.users;
  const tags = data.tags;

  const handleGoToAuthor = () => {
    router.push(`/users/${user.username}`);
  };

  return (
    <div>
      <div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 mt-8">
        <TitleInfoHeader
          type="blog"
          blogId={blog.id}
          title={blog.title}
          authorId={blog.authorId as string}
          authorName={user.username as string}
          authorUsername={user.username as string}
          authorProfileImageUrl={user.profileImageUrl as string}
          date={blog.createdAt?.toISOString() ?? ""}
        />
        <div className="mb-2 sm:mt-2 shrink-0">
          <CallToAction
            type="blog"
            blogId={blog.id}
            username={user.username as string}
            slug={blogSlug}
            authorId={user.id}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 lg:w-2/3">
          {blog.featuredImage && (
            <div className="mb-8">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                width={800}
                height={600}
                className="rounded-lg object-cover w-full h-144"
              />
            </div>
          )}

          <div className="mb-6">
            <Badge
              variant="outline"
              className="px-6 py-1.5 text-sm rounded-full"
            >
              {blog.topic}
            </Badge>
          </div>

          <BlogContentRenderer
            contentBlocks={(blog.contentBlocks as ContentBlock[]) ?? []}
          />

          <CommentsSection type="blog" blogId={blog.id} />

          {/* isolate the lazy query so it doesn't cause parent flash */}
          <RelatedRecipes blogId={blog.id} />
        </div>

        <div className="lg:w-1/3 space-y-8">
          <div className="border rounded-lg p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage
                src={user.profileImageUrl ?? ""}
                className="object-cover"
              />
              <AvatarFallback>
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg mb-2">{user.username}</h3>
            {user.bio && (
              <p className="text-sm text-gray-600 mb-4">{user.bio}</p>
            )}
            <Button
              onClick={handleGoToAuthor}
              className="bg-primary-200 hover:bg-primary-300 text-white w-full"
            >
              Visit Profile
            </Button>
          </div>

          <BlogCategoryGrid blogId={blog.id} />
          <TagsSection tags={tags} />
        </div>
      </div>
    </div>
  );
}

function RelatedRecipes({ blogId }: { blogId: string }) {
  const { data: relatedRecipe } = useGetRelatedRecipeId(blogId);

  if (!relatedRecipe?.recipeId) return null;

  return (
    <RecipeRecommendationGrid
      recipeId={relatedRecipe.recipeId}
      title="Related Recipes"
    />
  );
}

interface ContentBlock {
  type: "paragraph" | "quote" | "image" | "heading" | "list";
  value?: string;
  author?: string;
  url?: string;
  level?: number;
  items?: string[];
}

function BlogContentRenderer({
  contentBlocks,
}: {
  contentBlocks: ContentBlock[];
}) {
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="text-lg leading-relaxed text-gray-700 mb-6">
            {block.value}
          </p>
        );
      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-primary-200 pl-6 my-8 italic text-gray-600"
          >
            <p className="text-lg mb-2">{block.value}</p>
            {block.author && (
              <cite className="text-sm font-medium text-primary-200">
                - {block.author}
              </cite>
            )}
          </blockquote>
        );
      case "image":
        if (!block.url) return null;
        return (
          <div key={index} className="my-8">
            <Image
              src={block.url}
              alt="Content Image"
              width={800}
              height={400}
              className="rounded-lg object-cover w-full"
            />
          </div>
        );
      case "heading": {
        const HeadingTag =
          `h${block.level || 2}` as keyof JSX.IntrinsicElements;
        const headingClasses: Record<number, string> = {
          1: "text-3xl font-bold text-gray-900 mb-6 mt-8",
          2: "text-2xl font-bold text-gray-900 mb-4 mt-8",
          3: "text-xl font-bold text-gray-900 mb-4 mt-6",
          4: "text-lg font-bold text-gray-900 mb-3 mt-6",
          5: "text-base font-bold text-gray-900 mb-3 mt-4",
          6: "text-sm font-bold text-gray-900 mb-2 mt-4",
        };
        return (
          <HeadingTag key={index} className={headingClasses[block.level ?? 2]}>
            {block.value}
          </HeadingTag>
        );
      }
      case "list":
        return (
          <ul key={index} className="list-disc mb-6 space-y-2">
            {block.items?.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="text-lg leading-relaxed text-gray-700 ml-4"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="prose max-w-none mb-8">
      {contentBlocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
