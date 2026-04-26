"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type BillingInterval } from "@/features/billing/constants/plans";

type BillingToggleProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
};

const BillingToggle = ({ value, onChange }: BillingToggleProps) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "px-5 py-2 text-sm font-semibold rounded-full transition-all",
          value === "monthly"
            ? "bg-white text-primary-300 shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "px-5 py-2 text-sm font-semibold rounded-full transition-all flex items-center gap-2",
          value === "yearly"
            ? "bg-white text-primary-300 shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        Yearly
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            value === "yearly"
              ? "bg-primary-200 text-white"
              : "bg-gray-200 text-gray-500",
          )}
        >
          -20%
        </span>
      </button>
    </div>
  );
};

export default BillingToggle;
