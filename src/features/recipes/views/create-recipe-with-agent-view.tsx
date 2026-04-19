"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppTitle from "@/components/app-title";
import { EXAMPLE_PROMPTS } from "@/features/recipes/constants";
import { useCreateRecipeWithAgent } from "@/hooks/trpcHooks/use-recipes-agent";

export default function CreateRecipeWithAgentView({
  username,
}: {
  username: string;
}) {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const createRecipe = useCreateRecipeWithAgent();

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a recipe prompt");
      return;
    }

    createRecipe.mutate(
      { prompt },
      {
        onSuccess: () => {
          toast.success(
            "Your recipe is being generated! Check back in a moment.",
          );
          setPrompt("");
          router.push("/recipes");
        },
        onError: () => {
          toast.error("Failed to start recipe generation");
        },
      },
    );
  };

  const isLoading = createRecipe.isPending;

  return (
    <div>
      <div className="flex justify-between items-center pb-16">
        <AppTitle title="Get inspired to cook" />
        <Button
          variant="outline"
          className="border-none text-primary-200 hover:bg-primary-100 hover:text-primary-200/80 transition-colors font-medium text-lg"
          onClick={() => router.push(`/${username}/recipes/new`)}
        >
          Create Manually
        </Button>
      </div>

      <div className="w-full mx-auto max-w-5xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <Label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              What would you like to cook?
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the recipe you want to create (e.g., 'healthy pasta with vegetables', 'chocolate chip cookies', etc.)"
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-200 resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="flex-1 bg-primary-200 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-10"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Start generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Get Inspired
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPrompt("")}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors h-10"
            >
              Clear
            </Button>
          </div>
        </form>

        {/* Example prompts */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Need inspiration? Try these:
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <Button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-50 hover:text-primary-200 disabled:opacity-50 transition-colors"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-primary-800 mb-2">
            💡 Tips for better results:
          </h4>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>
              • Be specific about cuisine type (e.g., Italian, Thai, Mexican)
            </li>
            <li>
              • Mention dietary preferences (e.g., vegan, gluten-free, low-carb)
            </li>
            <li>
              • Include cooking time if important (e.g., quick 15-minute,
              slow-cooked)
            </li>
            <li>• Specify serving size (e.g., for 4 people, family-sized)</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="bg-primary-100 border border-primary-100 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-primary-300 mb-2">
            ✨ How it works:
          </h4>
          <ol className="text-sm text-primary-200 space-y-1">
            <li>1. Enter your recipe idea above</li>
            <li>
              2. We&apos;ll generate a complete recipe with ingredients and
              instructions
            </li>
            <li>
              3. The recipe will appear in your recipes collection within 1-2
              minutes
            </li>
            <li>4. You can then edit, save, or share your generated recipe</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
