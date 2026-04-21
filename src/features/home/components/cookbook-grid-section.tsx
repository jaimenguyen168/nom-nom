"use client";

import React from "react";
import { useGetCookbooks } from "@/hooks/trpcHooks/use-cookbooks";
import { useRouter } from "next/navigation";
import { CookbookCard } from "@/features/cookbooks/components/cookbook-card";

const CookbookGridSection = () => {
  const router = useRouter();
  const { data } = useGetCookbooks(1, 5);
  const cookbooks = data?.items ?? [];

  if (cookbooks.length === 0) return null;

  return (
    <section className="w-full min-h-48">
      <div className="flex items-center justify-between mb-8 h-full">
        <h2 className="text-xl font-semibold">Cookbooks</h2>
        <button
          onClick={() => router.push("/cookbooks")}
          className="text-primary-200 font-medium cursor-pointer hover:text-primary-200/80"
        >
          View more
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
        {cookbooks.map((cookbook, index) => (
          <CookbookCard
            key={cookbook.id}
            cookbook={cookbook}
            index={index}
            href={`/cookbooks/${cookbook.slug}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CookbookGridSection;
