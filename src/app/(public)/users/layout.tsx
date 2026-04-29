import React from "react";
import { ClientUsersLayout } from "@/components/layouts/client-users-layout";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <ClientUsersLayout />
      {children}
    </div>
  );
}
