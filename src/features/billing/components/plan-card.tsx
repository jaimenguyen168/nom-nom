"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon, XIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  type BillingInterval,
  type Plan,
} from "@/features/billing/constants/plans";

type PlanCardProps = {
  plan: Plan;
  interval: BillingInterval;
  href?: string;
  ctaLabel?: string;
  ctaDisabled?: boolean;
};

const PlanCard = ({
  plan,
  interval,
  href,
  ctaLabel,
  ctaDisabled,
}: PlanCardProps) => {
  const isFree = plan.id === "free";
  const price = plan.price[interval];
  const fallbackHref = isFree ? "/sign-up" : `/billing?plan=${plan.id}`;
  const finalHref = href ?? fallbackHref;
  const finalLabel = ctaLabel ?? plan.ctaLabel;

  return (
    <Card
      className={cn(
        "relative flex flex-col p-6 gap-6 transition-all duration-200",
        plan.highlighted
          ? "border-primary-200 shadow-lg shadow-primary-100 -translate-y-2 bg-white"
          : "border-gray-100 hover:shadow-md hover:-translate-y-1 bg-white",
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary-200 px-3 py-1 text-xs font-semibold text-white shadow-md">
          <SparklesIcon className="size-3" />
          Most popular
        </div>
      )}

      <div className="space-y-1">
        <h3
          className={cn(
            "text-xl font-bold",
            plan.highlighted ? "text-primary-300" : "text-gray-900",
          )}
        >
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500">{plan.tagline}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gray-900">${price}</span>
        <span className="text-sm text-gray-500">
          {price === 0 ? "forever" : "/ month"}
        </span>
      </div>

      <ul className="flex-1 space-y-3">
        {plan.features.map((f) => (
          <li
            key={f.label}
            className={cn(
              "flex items-start gap-2 text-sm",
              f.included ? "text-gray-700" : "text-gray-300",
            )}
          >
            {f.included ? (
              <CheckIcon
                className={cn(
                  "size-4 mt-0.5 shrink-0",
                  plan.highlighted ? "text-primary-200" : "text-primary-300",
                )}
              />
            ) : (
              <XIcon className="size-4 mt-0.5 shrink-0 text-gray-300" />
            )}
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      <Link href={ctaDisabled ? "#" : finalHref} aria-disabled={ctaDisabled}>
        <Button
          disabled={ctaDisabled}
          className={cn(
            "w-full font-semibold py-6 text-base shadow-md shadow-white",
            plan.highlighted
              ? "bg-primary-300 hover:bg-primary-400 text-white"
              : isFree
                ? "bg-white hover:bg-primary-100 text-primary-300 border border-primary-200"
                : "bg-primary-200 hover:bg-primary-300 text-white",
          )}
        >
          {finalLabel}
        </Button>
      </Link>
    </Card>
  );
};

export default PlanCard;
