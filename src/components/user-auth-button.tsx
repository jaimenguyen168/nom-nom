"use client";

import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LogOutIcon,
  MonitorUpIcon,
  User2Icon,
  ClipboardPenLineIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const UserAuthButton = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton>
        <Button className="pl-4 pr-3 py-2 bg-primary-200 text-white rounded-lg font-semibold">
          Get Started <ChevronRightIcon />
        </Button>
      </SignInButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none rounded-full hover:opacity-80 transition-opacity">
          <Image
            src={user?.imageUrl || "/no-image.svg"}
            alt={user?.firstName ? `${user.firstName}'s avatar` : "User avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full">
            Go to Profile <User2Icon className="ml-auto text-primary-200" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/recipes/new/" className="w-full">
            Create a Recipe{" "}
            <ClipboardPenLineIcon className="ml-auto text-primary-200" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/blogs/new/" className="w-full">
            Create a Blog <MonitorUpIcon className="ml-auto text-primary-200" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
          Log out <LogOutIcon className="ml-auto text-primary-200" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAuthButton;
