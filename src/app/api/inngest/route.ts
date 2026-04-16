import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { createRecipeWithAgent } from "@/inngest/recipe-functions";
import { createBlogWithAgent } from "@/inngest/blog-functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [createRecipeWithAgent, createBlogWithAgent],
});
