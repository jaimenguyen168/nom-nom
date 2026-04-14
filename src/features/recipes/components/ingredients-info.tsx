import React, { useCallback, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Ingredient {
  id: string;
  name: string;
  amount?: string | null;
  unit?: string | null;
  category?: string | null;
  isOptional: boolean | null;
  notes?: string | null;
  orderIndex: number;
  recipeId: string;
  checked?: boolean;
}

interface IngredientsInfoProps {
  ingredients: Ingredient[];
  description?: string;
}

type IngredientProgress = {
  id: string;
  checked: boolean;
};

const IngredientsInfo = ({
  ingredients: initialIngredients,
  description,
}: IngredientsInfoProps) => {
  const recipeId = initialIngredients[0]?.recipeId;

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    if (typeof window === "undefined") return initialIngredients;

    const saved = localStorage.getItem(`recipe-${recipeId}-progress`);
    if (!saved) return initialIngredients;

    const progress: IngredientProgress[] = JSON.parse(saved);
    return initialIngredients.map((ing) => ({
      ...ing,
      checked: progress.find((p) => p.id === ing.id)?.checked || false,
    }));
  });

  // Handle checkbox changes
  const handleIngredientToggle = useCallback(
    (id: string) => {
      setIngredients((prev) => {
        const updated = prev.map((ingredient) =>
          ingredient.id === id
            ? { ...ingredient, checked: !ingredient.checked }
            : ingredient,
        );

        // Save to localStorage (persists longer than sessionStorage)
        localStorage.setItem(
          `recipe-${recipeId}-progress`,
          JSON.stringify(
            updated.map((ing) => ({ id: ing.id, checked: ing.checked })),
          ),
        );

        return updated;
      });
    },
    [recipeId],
  );

  // Get checked ingredients count
  const checkedCount = ingredients.filter((item) => item.checked).length;
  const totalCount = ingredients.length;

  // Format ingredient display text
  const formatIngredientText = (ingredient: Ingredient) => {
    const parts = [];

    if (ingredient.amount) {
      parts.push(ingredient.amount);
    }

    if (ingredient.unit) {
      parts.push(ingredient.unit);
    }

    parts.push(ingredient.name);

    if (ingredient.notes) {
      parts.push(`(${ingredient.notes})`);
    }

    return parts.join(" ");
  };

  return (
    <div className="mb-8">
      {/* Recipe Description */}
      {description && (
        <div className="mb-8">
          <p className="text-gray-700 text-lg">{description}</p>
        </div>
      )}

      {/* Ingredients Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Ingredients:</h2>
        <span className="text-sm text-gray-500">
          {checkedCount} of {totalCount} checked
        </span>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-start gap-3">
            <Checkbox
              id={`ingredient-${ingredient.id}`}
              checked={ingredient.checked || false}
              onCheckedChange={() => handleIngredientToggle(ingredient.id)}
              className="w-4 h-4 mt-1 border-primary-200 text-primary-200 focus:ring-primary-200 data-[state=checked]:bg-primary-200 data-[state=checked]:border-primary-200"
            />
            <label
              htmlFor={`ingredient-${ingredient.id}`}
              className={`text-gray-700 cursor-pointer transition-all duration-200 flex-1 ${
                ingredient.checked
                  ? "line-through text-gray-400"
                  : "text-gray-700"
              } ${ingredient.isOptional ? "italic text-gray-600" : ""}`}
            >
              {formatIngredientText(ingredient)}
              {ingredient.isOptional && (
                <span className="text-xs text-gray-500 ml-1">(optional)</span>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
export default IngredientsInfo;
