import React from "react";
import { ClientCategoriesLayout } from "@/components/layouts/client-categories-layout";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <ClientCategoriesLayout />
      {children}
    </div>
  );
}
