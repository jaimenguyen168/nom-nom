import React from "react";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="size-8 animate-spin text-primary" />
    </div>
  );
}
