"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const AboutView = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-gray-600 hover:text-gray-800"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black font-semibold">
              About Us
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
      </div>

      {/* First Section - Text Only */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Where Flavor and Community Meet
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 w-full">
          NomNom is a space built for food lovers of all kinds. From comforting
          home-style meals to bold new ideas from our blog, you’ll always find
          something worth trying. You can save your favorite recipes, create
          your own, and share them with others who love good food just as much
          as you do. With every post and every dish, our community grows, and so
          does the inspiration.
        </p>
      </div>

      {/* Second Section - Image and Text Side by Side */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
        <div className="w-full lg:w-1/2">
          <Image
            src="/recipe-6.png"
            alt="Delicious pancakes with syrup"
            width={400}
            height={300}
            className="rounded-lg object-cover w-full h-75"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore Our Delicious Recipes
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            At NomNom, we believe in the power of food to bring people together,
            to create cherished memories, and to nourish the soul. Our passion
            for cooking and sharing delectable recipes is at the core of
            everything we do. It&apos;s a passion that has simmered for
            generations and, with every recipe we share, continues to evolve and
            flourish.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-12">
          Our Great Team
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/user-1.png"
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Blogger 1
            </h3>
            <p className="text-gray-600">Food Blogger</p>
          </div>

          {/* Team Member 2 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/user-2.png"
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Chef 1</h3>
            <p className="text-gray-600">Chef</p>
          </div>

          {/* Team Member 3 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/user-3.jpg"
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Blogger 2
            </h3>
            <p className="text-gray-600">Food Blogger</p>
          </div>
        </div>
      </div>

      {/* Final Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Be One Of US</h2>
        <p className="text-lg leading-relaxed text-gray-700 mb-8 w-full">
          But this story isn&apos;t complete without you. Your feedback, your
          passion, and your shared moments in the kitchen are what give life to
          our recipes. Together, let&apos;s make every meal a masterpiece, every
          gathering a feast, and every bite a memory worth savoring.
        </p>

        <Link href="/contact" className="flex-1">
          <Button className="cursor-pointer bg-primary-200 text-white rounded font-semibold">
            Contact with us
          </Button>
        </Link>
      </div>
    </div>
  );
};
