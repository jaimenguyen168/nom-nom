import React from "react";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import BillingView from "@/features/billing/views/billing-view";
import { PLANS, DEFAULT_PLAN } from "@/features/billing/constants/plans";
import { getOrCreateUsage } from "@/features/billing/lib/usage";

export const metadata: Metadata = {
  title: "Billing & Plan — NomNom",
};

async function getServerPlanId(
  has: (params: { plan: string }) => boolean,
): Promise<string> {
  const paidPlans = [...PLANS].filter((p) => p.clerkPlanSlug).reverse();
  for (const plan of paidPlans) {
    if (has({ plan: plan.clerkPlanSlug! })) return plan.id;
  }
  return DEFAULT_PLAN;
}

export default async function BillingPage() {
  const { userId, has } = await auth();

  if (!userId) return null;

  const [initialPlanId, usage] = await Promise.all([
    getServerPlanId(has),
    getOrCreateUsage(userId),
  ]);

  return (
    <BillingView
      initialPlanId={initialPlanId}
      usage={{
        aiRecipes: usage.aiRecipesUsed,
        aiBlogs: usage.aiBlogsUsed,
      }}
    />
  );
}
