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
import CategoryItem from "@/features/categories/components/category-item";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";

const CategoriesView = () => {
  const { data: categories } = useGetCategories();

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-gray-500 hover:text-gray-700"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900 font-medium">
              Categories
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
