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

interface ClientCookbooksLayoutProps {
  isPrivate?: boolean;
}

export const ClientCookbooksLayout = ({
  isPrivate,
}: ClientCookbooksLayoutProps) => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const username = params?.username as string | undefined;
  const cookbookSlugParams = params?.cookbookSlug as string | undefined;
  const cookbookSlugQuery = searchParams.get("cookbookSlug") ?? undefined;
  const cookbookSlug = cookbookSlugParams || cookbookSlugQuery;

  const isEdit = pathname.endsWith("/edit");
  const isNew = pathname.endsWith("/new");
  const isSaved = pathname.endsWith("/saved");

  const formattedSlug = cookbookSlug ? formatSlugToTitle(cookbookSlug) : null;

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
                      <Link href={`/${username}/cookbooks/saved`}>
                        Saved Cookbooks
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>Saved Cookbooks</BreadcrumbPage>
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
                      <Link href={`/${username}/cookbooks`}>My Cookbooks</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>My Cookbooks</BreadcrumbPage>
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
                  <Link href="/cookbooks">Cookbooks</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Cookbooks</BreadcrumbPage>
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
