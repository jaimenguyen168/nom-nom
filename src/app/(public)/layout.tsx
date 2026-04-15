import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 overflow-x-hidden pt-8">{children}</div>;
}
