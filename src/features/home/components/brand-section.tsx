import React from "react";
import { FaApple, FaAmazon, FaGoogle } from "react-icons/fa";
import { TbBrandWalmart } from "react-icons/tb";
import { SiInstacart } from "react-icons/si";

const BrandsSection = () => {
  return (
    <section className="section-container py-24">
      <div className="flex justify-center items-center gap-12 flex-wrap">
        <FaApple size={32} />
        <FaAmazon size={32} />
        <FaGoogle size={32} />
        <TbBrandWalmart size={32} />
        <SiInstacart size={32} />
      </div>
    </section>
  );
};
export default BrandsSection;
