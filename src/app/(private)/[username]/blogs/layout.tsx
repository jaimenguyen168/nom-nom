import { ClientBlogsLayout } from "@/components/layouts/client-blogs-layout";

export default function PrivateBlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 pt-8">
      <ClientBlogsLayout isPrivate />
      {children}
    </div>
  );
}
