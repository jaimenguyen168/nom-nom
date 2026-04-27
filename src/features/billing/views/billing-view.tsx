"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ChefHatIcon,
  PenLineIcon,
  CalendarIcon,
  ExternalLinkIcon,
  CheckIcon,
  SparklesIcon,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppTitle from "@/components/app-title";
import UsageMeter from "@/features/billing/components/usage-meter";
import { startOfMonth, addMonths, format } from "date-fns";
import { PLANS, getPlan } from "@/features/billing/constants/plans";
import { useClerkBilling } from "@/features/billing/hooks/use-clerk-billing";
import { cn } from "@/lib/utils";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";

type BillingViewProps = {
  initialPlanId?: string;
  usage?: { aiRecipes: number; aiBlogs: number };
};

const BillingView = ({
  initialPlanId = "free",
  usage = { aiRecipes: 0, aiBlogs: 0 },
}: BillingViewProps) => {
  const clerk = useClerk();
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUser();
  const { planId, currentPlan, isFree, isLoading } = useClerkBilling();

  const activePlanId = isLoading ? initialPlanId : planId;
  const activePlan = isLoading ? getPlan(initialPlanId) : currentPlan;

  useEffect(() => {
    clerk.session?.reload().then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManageSubscription = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (clerk as any).__internal_openSubscriptionDetails({});
  };

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 space-y-8 pt-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${currentUser?.username}/profile`}>Profile</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Billing & Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AppTitle title="Billing & Plan" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full">
        {/* Current plan */}
        <Card className="p-6 md:p-8 border-primary-200/40 bg-linear-to-br from-white to-primary-100/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-300">
                Current plan
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  {activePlan.name}
                </h2>
                {activePlan.highlighted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-200 px-2 py-0.5 text-[10px] font-bold text-white">
                    <SparklesIcon className="size-3" />
                    POPULAR
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{activePlan.tagline}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                <CalendarIcon className="size-4" />
                <span>
                  {isFree ? "Status:" : "Plan:"}{" "}
                  <span className="font-semibold text-gray-700">
                    {isLoading
                      ? "Loading…"
                      : isFree
                        ? "Free forever"
                        : "Active"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isLoading && isFree ? (
                <Link href="/pricing">
                  <Button className="bg-primary-300 hover:bg-primary-400 text-white font-semibold px-6 py-5 shadow-md shadow-white">
                    Upgrade plan
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      className="border-primary-200 text-primary-300 hover:bg-primary-100 font-semibold px-6 py-5"
                    >
                      Change plan
                    </Button>
                  </Link>
                  <Button
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                    className="bg-primary-300 hover:bg-primary-400 text-white font-semibold px-6 py-5 shadow-md shadow-white"
                  >
                    Manage subscription
                    <ExternalLinkIcon className="size-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Usage */}
        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Usage this cycle
              </h3>
              <p className="text-sm text-gray-500">
                Resets on{" "}
                <span className="font-medium text-gray-700">
                  {format(startOfMonth(addMonths(new Date(), 1)), "MMM d, yyyy")}
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Limits set by{" "}
              <span className="font-semibold text-primary-300">
                {activePlan.name}
              </span>{" "}
              plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UsageMeter
              icon={ChefHatIcon}
              label="Recipe inspirations"
              description="Spark new recipes from prompts or photos"
              used={usage.aiRecipes}
              limit={activePlan.limits.aiRecipesPerMonth}
            />
            <UsageMeter
              icon={PenLineIcon}
              label="Blog inspirations"
              description="Draft posts in your voice"
              used={usage.aiBlogs}
              limit={activePlan.limits.aiBlogsPerMonth}
            />
          </div>
        </Card>

        {/* Plan comparison teaser */}
        {!activePlan.highlighted && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Unlock more with a higher tier
              </h3>
              <p className="text-sm text-gray-500">
                Compare what each plan includes — change at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === activePlanId;
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-xl border p-4 flex flex-col gap-3",
                      isCurrent
                        ? "border-primary-200 bg-primary-100/40"
                        : "border-gray-100 bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${plan.price.monthly}
                      <span className="text-sm text-gray-400 font-normal">
                        /mo
                      </span>
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {plan.features
                        .filter((f) => f.included)
                        .slice(0, 3)
                        .map((f) => (
                          <li
                            key={f.label}
                            className="flex items-start gap-1.5"
                          >
                            <CheckIcon className="size-3 mt-0.5 text-primary-300 shrink-0" />
                            <span>{f.label}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="border-primary-200 text-primary-300 hover:bg-primary-100 font-semibold"
                >
                  See full comparison →
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Billing history placeholder */}
        <Card className="p-6 md:p-8 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Billing history
            </h3>
            <p className="text-sm text-gray-500">
              Receipts and invoices will appear here.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
            No invoices yet.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingView;
