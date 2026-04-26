import React from "react";
import PricingView from "@/features/billing/views/pricing-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — NomNom",
  description:
    "Pick the NomNom plan that fits your kitchen. Generate AI recipes and blogs, save favorites, and share with the community.",
};

export default function PricingPage() {
  return <PricingView />;
}
