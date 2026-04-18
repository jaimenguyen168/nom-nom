"use client";

import React from "react";
import CategoryItem from "@/features/categories/components/category-item";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";
import AppTitle from "@/components/app-title";

const CategoriesView = () => {
  const { data: categories } = useGetCategories();

  return (
    <div className="space-y-8">
      <AppTitle title="Categories" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
