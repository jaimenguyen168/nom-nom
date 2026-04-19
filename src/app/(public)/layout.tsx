import React from "react";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 pt-8">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
