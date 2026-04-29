"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type UsageMeterProps = {
  icon: LucideIcon;
  label: string;
  used: number;
  // null = unlimited
  limit: number | null;
  description?: string;
};

const UsageMeter = ({
  icon: Icon,
  label,
  used,
  limit,
  description,
}: UsageMeterProps) => {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isWarn = !isUnlimited && pct >= 80 && pct < 100;
  const isOver = !isUnlimited && pct >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-primary-100 flex items-center justify-center">
            <Icon className="size-4 text-primary-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>

        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isOver
              ? "text-red-500"
              : isWarn
                ? "text-amber-600"
                : "text-gray-700",
          )}
        >
          {used}{" "}
          <span className="text-gray-400 font-normal">
            / {isUnlimited ? "∞" : limit}
          </span>
        </p>
      </div>

      <Progress
        value={isUnlimited ? 100 : pct}
        className={cn(
          "h-2",
          isUnlimited && "[&>div]:bg-primary-200",
          isOver && "[&>div]:bg-red-500",
          isWarn && "[&>div]:bg-amber-500",
        )}
      />
    </div>
  );
};

export default UsageMeter;
