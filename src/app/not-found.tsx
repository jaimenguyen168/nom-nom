import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 pb-24">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Oops! Page not found.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
