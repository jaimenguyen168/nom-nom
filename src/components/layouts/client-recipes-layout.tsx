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
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { formatSlugToTitle } from "@/lib/utils";

export const ClientRecipesLayout = () => {
  const params = useParams();
  const pathname = usePathname();

  const recipeSlug = params?.recipeSlug as string | undefined;
  const isEdit = pathname.endsWith("/edit");

  const formattedSlug = recipeSlug ? formatSlugToTitle(recipeSlug) : null;

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
          <BreadcrumbLink asChild>
            <Link href="/recipes">Recipes</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {formattedSlug && (
          <>
            <BreadcrumbSeparator />
            {isEdit ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/recipes/${recipeSlug}`}
                    className="capitalize"
                  >
                    {formattedSlug}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {formattedSlug}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
