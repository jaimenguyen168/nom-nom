"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserProfileError() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <h2 className="text-2xl font-bold">User not found</h2>
      <p className="text-gray-500">This profile doesn&apos;t exist or may have been removed.</p>
      <Button onClick={() => router.back()} variant="outline">
        Go back
      </Button>
    </div>
  );
}
