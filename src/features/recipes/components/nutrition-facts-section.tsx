import React from "react";
import { cn } from "@/lib/utils";

export interface Nutrition {
  amount: number;
  id: string;
  nutrientName: string;
  recipeId: string;
  unit: string;
}

interface NutritionFactsProps {
  className?: string;
  nutrition: Nutrition[];
}

const NutritionFactsSection = ({
  nutrition,
  className,
}: NutritionFactsProps) => {
  return (
    <div className={cn("bg-gray-100", className)}>
      <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
      <div className="space-y-3 text-sm">
        {nutrition.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-1 border-slate-300/50"
          >
            <span>{item.nutrientName}</span>
            <span className="font-semibold">
              {item.amount} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionFactsSection;
