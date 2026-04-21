"use client";

import React, { useState } from "react";
import { useGetCookbooks } from "@/hooks/trpcHooks/use-cookbooks";
import AppPagination from "@/components/app-pagination";
import { CookbookCard } from "@/features/cookbooks/components/cookbook-card";

const PAGE_SIZE = 12;

const CookbooksView = () => {
  const [page, setPage] = useState(1);
  const { data } = useGetCookbooks(page, PAGE_SIZE);
  const cookbooks = data?.items ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cookbooks</h1>
      </div>

      {cookbooks.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cookbooks found
          </h3>
          <p className="text-gray-500">Check back later for new cookbooks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-full mb-8">
          {cookbooks.map((cookbook, index) => (
            <CookbookCard
              key={cookbook.id}
              cookbook={cookbook}
              index={index}
              href={`/cookbooks/${cookbook.slug}`}
            />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default CookbooksView;
