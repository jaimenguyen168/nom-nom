import React from "react";
import { ClientCookbooksLayout } from "@/components/layouts/client-cookbooks-layout.tsx";

export default function CookbooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <ClientCookbooksLayout />
      {children}
    </div>
  );
}
