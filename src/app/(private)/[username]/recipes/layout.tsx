import React from "react";
import { ClientRecipesLayout } from "@/components/layouts/client-recipes-layout";

export default function PrivateRecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 pt-8">
      <ClientRecipesLayout isPrivate />
      {children}
    </div>
  );
}
