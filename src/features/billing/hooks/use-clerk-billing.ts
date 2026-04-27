"use client";

import { useAuth } from "@clerk/nextjs";
import {
  PLANS,
  DEFAULT_PLAN,
  getPlan,
} from "@/features/billing/constants/plans";

export type ClerkBilling = {
  /** Local plan ID derived from Clerk session claims */
  planId: string;
  /** Full plan object */
  currentPlan: ReturnType<typeof getPlan>;
  /** True when on the free tier (no active Clerk subscription) */
  isFree: boolean;
  /** False until Clerk has loaded the session */
  isLoading: boolean;
};

/**
 * Derives the user's local plan tier from Clerk's session claims.
 *
 * Clerk embeds the active plan slug(s) in the JWT under the `pla` claim.
 * `has({ plan: slug })` reads that claim — no extra network request needed.
 *
 * Usage:
 *   const { planId, currentPlan, isFree, isLoading } = useClerkBilling();
 */
export function useClerkBilling(): ClerkBilling {
  const { has, isLoaded } = useAuth();

  const getPlanId = () => {
    // Not ready yet — return default to avoid flash
    if (!isLoaded || !has) return DEFAULT_PLAN;

    // Walk paid plans from highest to lowest; first match wins
    const paidPlans = [...PLANS].filter((p) => p.clerkPlanSlug).reverse();
    for (const plan of paidPlans) {
      if (has({ plan: plan.clerkPlanSlug! })) return plan.id;
    }

    return DEFAULT_PLAN;
  };

  const planId = getPlanId();

  return {
    planId,
    currentPlan: getPlan(planId),
    isFree: planId === "free",
    isLoading: !isLoaded,
  };
}
