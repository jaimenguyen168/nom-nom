import React from "react";
import PinkGradientShape from "@/features/home/components/pink-gradient-shape";
import HomeHero from "@/features/home/components/home-hero";
import ShareYourRecipe from "@/features/home/components/share-your-recipe";
import RecipeGridSection from "@/features/home/components/recipe-grid-section";
import BlogGridSection from "@/features/home/components/blog-grid-section";
import StayInTouchSection from "@/features/home/components/stay-in-touch-section";
import CategorySection from "@/features/home/components/category-section";
import BrandsSection from "@/features/home/components/brand-section";

export default function HomeView() {
  return (
    <div className="flex-col flex justify-center items-center overflow-y-auto overflow-x-hidden">
      <PinkGradientShape />

      <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 flex flex-col gap-16">
        <HomeHero />
        <ShareYourRecipe />
        <RecipeGridSection feedType="trending" />
        <BlogGridSection />
        <RecipeGridSection feedType="new" />
      </div>

      <StayInTouchSection />

      <div className="container mx-auto px-8 md:px-12 pb-16 flex flex-col gap-16">
        <CategorySection />
        <BrandsSection />
      </div>
    </div>
  );
}
