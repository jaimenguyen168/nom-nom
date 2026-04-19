"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error = () => {};
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-24 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <AlertCircle className="size-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">{error.message}</p>
      <Button onClick={() => router.replace("/")}>Back to home</Button>
    </div>
  );
}
