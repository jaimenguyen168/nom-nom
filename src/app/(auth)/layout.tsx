import ClientAuthLayout from "@/components/layouts/client-auth-layout";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthLayout>
      <div className="w-full bg-white font-roboto flex flex-col">
        <main className="py-12 flex-1">
          <div className="flex items-center justify-center pb-12 px-4">
            <div className="max-w-6xl w-full justify-center mx-auto md:grid md:grid-cols-2 lg:grid-cols-3">
              <div className="hidden md:block md:col-span-1 lg:col-span-2 pr-8 ml-8">
                <Image
                  src="https://images.unsplash.com/photo-1668285410063-4e5f2686b55d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Authentication illustration"
                  width={1287}
                  height={612}
                  className="h-150 object-cover rounded-lg w-full"
                />
              </div>
              <div className="w-full flex justify-center items-center">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ClientAuthLayout>
  );
}
