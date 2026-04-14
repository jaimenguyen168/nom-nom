import React from "react";
import ClientPrivateLayout from "@/components/layouts/client-private-layout";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientPrivateLayout>{children}</ClientPrivateLayout>;
}
