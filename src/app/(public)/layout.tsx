import React from "react";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-x-hidden pt-8">
      {children}
      <Footer />
    </div>
  );
}
