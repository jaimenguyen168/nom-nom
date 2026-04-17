"use client";

import React from "react";
import Link from "next/link";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";
import CategoryItem from "@/features/categories/components/category-item";

const CategorySection = () => {
  const { data: categories } = useGetCategories();

  if (!categories?.length) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Popular Categories</h2>
        <Link
          href="/categories"
          className="text-primary-200 font-medium hover:text-primary-200/80"
        >
          View more
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {categories.slice(0, 8).map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
