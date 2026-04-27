"use client";

import React, { useState } from "react";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";
import PinkGradientShape from "@/features/home/components/pink-gradient-shape";
import PlanCard from "@/features/billing/components/plan-card";
import BillingToggle from "@/features/billing/components/billing-toggle";
import PricingFaq from "@/features/billing/components/pricing-faq";
import {
  PLANS,
  type BillingInterval,
} from "@/features/billing/constants/plans";
import { useClerkBilling } from "@/features/billing/hooks/use-clerk-billing";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";

const PricingView = () => {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const { planId, isLoading } = useClerkBilling();
  const { data: user } = useGetCurrentUser();
  const billingHref = user?.username ? `/${user.username}/billing` : "/sign-in";

  return (
    <div className="flex-col flex justify-center items-center">
      <PinkGradientShape />

      <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 flex flex-col gap-16 w-full">
        {/* Hero */}
        <section className="text-center pt-12 z-20 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-300">
            <SparklesIcon className="size-3.5" />
            Powered by AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Cook smarter with a plan that{" "}
            <span className="text-primary-200">fits your kitchen</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Spark new recipe ideas, draft blog posts in your voice, save your
            favorites, and share them with the community. Pick the plan that
            matches how often you cook — change or cancel any time.
          </p>

          <div className="flex justify-center pt-2">
            <BillingToggle value={interval} onChange={setInterval} />
          </div>
        </section>

        {/* Plans */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-20">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              isCurrentPlan={!isLoading && planId === plan.id}
            />
          ))}
        </section>

        {/* Compare strip */}
        <section className="rounded-2xl bg-primary-100/60 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900">
              Not sure which plan?
            </h3>
            <p className="text-gray-600 text-sm">
              Start free — you can upgrade later in one click from your billing
              page.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Already a member?</span>
            <Link
              href={billingHref}
              className="text-primary-300 font-semibold hover:text-primary-400"
            >
              Manage your plan →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <PricingFaq />
      </div>
    </div>
  );
};

export default PricingView;
