import React from "react";
import { ClientRecipesLayout } from "@/components/layouts/client-recipes-layout";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <ClientRecipesLayout />
      {children}
    </div>
  );
}
