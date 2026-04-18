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
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatSlugToTitle } from "@/lib/utils";

export const ClientCategoriesLayout = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const categorySlug = params?.categorySlug as string | undefined;
  const recipeSlug = searchParams.get("recipeSlug") ?? undefined;
  const categoryName = searchParams.get("categoryName");

  const formattedCategory =
    categoryName || (categorySlug ? categorySlug.replace(/-/g, " ") : null);

  const formattedRecipe = recipeSlug ? formatSlugToTitle(recipeSlug) : null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {categorySlug ? (
            <BreadcrumbLink asChild>
              <Link href="/categories">Categories</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Categories</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {formattedCategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {formattedRecipe ? (
                <BreadcrumbLink asChild className="capitalize">
                  <Link href={`/categories/${categorySlug}`}>
                    {formattedCategory}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="capitalize">
                  {formattedCategory}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {formattedRecipe && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {formattedRecipe}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
