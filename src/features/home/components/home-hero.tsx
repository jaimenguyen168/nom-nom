"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import StarRatings from "@/components/star-ratings";

const HomeHero = () => {
  const { user, isLoaded } = useUser();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 section-container gap-6">
      <div className="flex-col flex col-span-1 space-y-6 justify-center items-center text-center md:text-start md:items-start z-30">
        <h1 className="text-4xl font-bold text-black">
          Your Daily Dish
          <br /> A <span className="text-primary-200">Food</span> Journey
        </h1>
        <p className="text-gray-300">
          Explore a world of mouthwatering recipes crafted for every occasion,
          skill level, and dietary preference. Let us guide you through a
          delightful culinary adventure where cooking becomes effortless and
          every meal tells a story.
        </p>

        {isLoaded && !user && (
          <div className="flex-col flex space-y-4 items-center md:items-start">
            <Link href="/sign-up">
              <Button className="px-16 py-6 bg-primary-300 text-white text-lg font-semibold max-w-fit hover:bg-primary-400 shadow-md shadow-white">
                Sign up
              </Button>
            </Link>
            <p className="text-gray-300">
              Do you have an account?{" "}
              <Link href="/sign-in">
                <span className="text-primary-200 font-semibold">Log in</span>
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="hidden md:col-span-1 md:flex justify-end items-end relative">
        <Image
          src="/food.png"
          alt="food"
          width={100}
          height={100}
          className="size-80"
        />

        <div className="absolute bottom-0 left-0">
          <Card className="bg-white lg:ml-16 relative shadow-lg px-2 py-3">
            <CardTitle>
              <Image
                src="/person-1.jpg"
                alt="person"
                width={100}
                height={100}
                className="absolute -top-8 left-4 size-24 border-2 border-gray-100 rounded-full shadow-lg p-1 bg-amber-50"
              />
              <div className="pl-32">
                <h2 className="text-xl font-semibold text-black">Nick</h2>
                <StarRatings rating={4} />
              </div>
            </CardTitle>
            <CardContent>
              <p>
                The best thing about this recipe is that it&apos;s so easy to
                make. You just need some basic ingredients and a few tools, and
                you&apos;re good to go!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
