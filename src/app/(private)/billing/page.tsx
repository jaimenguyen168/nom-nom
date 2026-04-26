import React from "react";
import BillingView from "@/features/billing/views/billing-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing & Plan — NomNom",
};

export default function BillingPage() {
  return <BillingView />;
}
