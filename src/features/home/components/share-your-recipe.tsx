"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";

const ShareYourRecipe = () => {
  const { isSignedIn } = useAuth();
  const { data: currentUser } = useGetCurrentUser();

  const href =
    isSignedIn && currentUser
      ? `/${currentUser.username}/recipes/new`
      : "/sign-in";

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-6 section-container">
      <div className="w-full min-w-sm max-w-sm aspect-square relative">
        <Image
          src="/share-recipe.png"
          alt="Share your recipe"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="text-center md:text-left max-w-2xl space-y-3 z-20">
        <h2 className="text-3xl font-semibold">
          Share Your <span className="text-primary-200">Recipes</span>
        </h2>
        <h3 className="font-semibold text-lg">
          Cook. Share. Inspire. Join a community of food lovers!
        </h3>
        <p className="text-gray-600 px-4 md:px-0">
          Your favorite dishes deserve to be shared! Post your best recipes,
          discover new favorites, and connect with fellow food enthusiasts.
          Whether it&apos;s a family tradition or your latest kitchen experiment
          – cook, share, and inspire together.
        </p>
        <Link href={href}>
          <Button className="bg-primary-300 text-white p-6 hover:bg-primary-400 transition mt-4 font-semibold text-lg shadow-md shadow-white">
            Create New Recipe
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ShareYourRecipe;
