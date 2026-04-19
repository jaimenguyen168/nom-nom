"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatSlugToTitle } from "@/lib/utils";

interface ClientRecipesLayoutProps {
  isPrivate?: boolean;
}

export const ClientRecipesLayout = ({
  isPrivate,
}: ClientRecipesLayoutProps) => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const username = params?.username as string | undefined;
  const recipeSlugParam = params?.recipeSlug as string | undefined;
  const recipeSlugQuery = searchParams.get("recipeSlug") ?? undefined;
  const recipeSlug = recipeSlugParam || recipeSlugQuery;

  const isEdit = pathname.endsWith("/edit");
  const isNew = pathname.endsWith("/new");
  const isSaved = pathname.endsWith("/saved");

  const formattedSlug = recipeSlug ? formatSlugToTitle(recipeSlug) : null;

  if (isEdit || isNew) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {isPrivate ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${username}/profile`}>Profile</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {isSaved ? (
              <>
                <BreadcrumbItem>
                  {formattedSlug ? (
                    <BreadcrumbLink asChild>
                      <Link href={`/${username}/recipes/saved`}>
                        Saved Recipes
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>Saved Recipes</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {formattedSlug && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {formattedSlug}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  {formattedSlug ? (
                    <BreadcrumbLink asChild>
                      <Link href={`/${username}/recipes`}>My Recipes</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>My Recipes</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {formattedSlug && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {formattedSlug}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <BreadcrumbItem>
              {formattedSlug ? (
                <BreadcrumbLink asChild>
                  <Link href="/recipes">Recipes</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Recipes</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {formattedSlug && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {formattedSlug}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
