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

interface ClientBlogsLayoutProps {
  isPrivate?: boolean;
}

export const ClientBlogsLayout = ({ isPrivate }: ClientBlogsLayoutProps) => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const username = params?.username as string | undefined;
  const blogSlugParam = params?.blogSlug as string | undefined;
  const blogSlugQuery = searchParams.get("blogSlug") ?? undefined;
  const blogSlug = blogSlugParam || blogSlugQuery;

  const isEdit = pathname.endsWith("/edit");
  const isNew = pathname.endsWith("/new");
  const isSaved = pathname.endsWith("/saved");

  const formattedSlug = blogSlug ? formatSlugToTitle(blogSlug) : null;

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
                      <Link href={`/${username}/blogs/saved`}>Saved Blogs</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>Saved Blogs</BreadcrumbPage>
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
                      <Link href={`/${username}/blogs`}>My Blogs</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>My Blogs</BreadcrumbPage>
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
                  <Link href="/blogs">Blogs</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Blogs</BreadcrumbPage>
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
