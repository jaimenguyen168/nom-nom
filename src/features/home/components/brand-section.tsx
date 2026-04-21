"use client";

import React, { SVGProps } from "react";
import { FaApple, FaAmazon, FaGoogle } from "react-icons/fa";
import { TbBrandWalmart } from "react-icons/tb";
import { SiInstacart } from "react-icons/si";
import { LogoCarousel } from "@/components/ui/logo-carousel";

const brands = [
  {
    name: "Apple",
    id: 1,
    img: (props: SVGProps<SVGSVGElement>) => (
      <FaApple size={32} {...props} />
    ),
  },
  {
    name: "Amazon",
    id: 2,
    img: (props: SVGProps<SVGSVGElement>) => (
      <FaAmazon size={32} {...props} />
    ),
  },
  {
    name: "Google",
    id: 3,
    img: (props: SVGProps<SVGSVGElement>) => (
      <FaGoogle size={32} {...props} />
    ),
  },
  {
    name: "Walmart",
    id: 4,
    img: (props: SVGProps<SVGSVGElement>) => (
      <TbBrandWalmart size={32} {...props} />
    ),
  },
  {
    name: "Instacart",
    id: 5,
    img: (props: SVGProps<SVGSVGElement>) => (
      <SiInstacart size={32} {...props} />
    ),
  },
];

const BrandsSection = () => {
  return (
    <section className="section-container py-24">
      <div className="flex justify-center items-center">
        <LogoCarousel columnCount={5} logos={brands} />
      </div>
    </section>
  );
};

export default BrandsSection;
