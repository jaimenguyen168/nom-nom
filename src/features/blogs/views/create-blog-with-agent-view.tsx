"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppTitle from "@/components/app-title";
import { useCreateBlogWithAgent } from "@/hooks/trpcHooks/use-blogs-agent";

const EXAMPLE_PROMPTS = [
  "The ultimate guide to homemade pasta",
  "10 must-try street foods from around the world",
  "How to build the perfect charcuterie board",
  "The art of making sourdough bread at home",
  "Classic cocktails every home bartender should know",
];

export default function CreateBlogWithAgentView() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const createBlog = useCreateBlogWithAgent();

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a blog prompt");
      return;
    }

    createBlog.mutate(
      { prompt },
      {
        onSuccess: () => {
          toast.success(
            "Your blog post is being generated! Check back in a moment.",
          );
          setPrompt("");
          router.push("/blogs");
        },
        onError: () => {
          toast.error("Failed to start blog generation");
        },
      },
    );
  };

  const isLoading = createBlog.isPending;

  return (
    <div>
      <div className="flex justify-between items-center pb-16">
        <AppTitle title="Get inspired to write" />
        <Button
          variant="outline"
          className="border-none text-primary-200 hover:bg-primary-100 hover:text-primary-200/80 transition-colors font-medium text-lg"
          onClick={() => router.push("/blogs/new")}
        >
          Write Manually
        </Button>
      </div>

      <div className="w-full mx-auto max-w-5xl">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              What would you like to write about?
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the blog post you want to create (e.g., 'a guide to sourdough bread', 'best cocktails for summer', etc.)"
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-200 resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 bg-primary-200 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-10"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
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
        </div>

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

        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-primary-800 mb-2">
            💡 Tips for better results:
          </h4>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>
              • Be specific about the topic (e.g., Italian pasta making vs.
              pasta)
            </li>
            <li>
              • Mention the audience (e.g., for beginners, for home cooks)
            </li>
            <li>• Include the tone (e.g., casual, informative, fun)</li>
            <li>• Add context (e.g., seasonal, budget-friendly, quick)</li>
          </ul>
        </div>

        <div className="bg-primary-100 border border-primary-100 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-primary-300 mb-2">
            ✨ How it works:
          </h4>
          <ol className="text-sm text-primary-200 space-y-1">
            <li>1. Enter your blog idea above</li>
            <li>
              2. We&apos;ll generate a complete blog post with rich content
            </li>
            <li>3. The post will appear in your blogs within 1-2 minutes</li>
            <li>4. You can then edit, save, or share your generated post</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
