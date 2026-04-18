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

export const ClientBlogsLayout = () => {
  const params = useParams();
  const pathname = usePathname();

  const blogSlug = params?.blogSlug as string | undefined;
  const isEdit = pathname.endsWith("/edit");

  const formattedSlug = blogSlug ? formatSlugToTitle(blogSlug) : null;

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
            <Link href="/blogs">Blogs</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {formattedSlug && (
          <>
            <BreadcrumbSeparator />
            {isEdit ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/blogs/${blogSlug}`}
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
