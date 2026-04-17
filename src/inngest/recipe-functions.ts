import { inngest } from "./client";
import { generateText } from "ai";
import { nomnomDb } from "@/db";
import {
  recipes,
  recipeIngredients,
  recipeInstructions,
  recipeNutrition,
  recipeTags,
  recipeCategories,
} from "@/db/schemas/recipes";
import { z } from "zod";
import { createGroq } from "@ai-sdk/groq";
import { slugify } from "@/lib/utils";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const aiRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string().optional(),
      unit: z.string().optional(),
      isOptional: z.boolean().default(false),
    }),
  ),
  instructions: z.array(
    z.object({
      stepNumber: z.number(),
      instruction: z.string(),
    }),
  ),
  nutrition: z
    .array(
      z.object({
        nutrientName: z.string(),
        amount: z.number(),
        unit: z.string(),
      }),
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  servings: z.number(),
  prepTime: z.object({
    hours: z.string().default("0"),
    minutes: z.string(),
  }),
  cookingTime: z.object({
    hours: z.string().default("0"),
    minutes: z.string(),
  }),
});

const RECIPE_GENERATION_PROMPT = `You are an expert chef and recipe creator with deep knowledge of global cuisines and culinary history. Create a detailed, practical recipe based on the user's request.

You must respond with ONLY a valid JSON object with the following structure (no markdown, no extra text):

{
  "title": "Recipe name",
  "description": "A rich, detailed description (3-4 sentences) that includes the dish's cultural origin, what makes it special or unique, its flavor profile, and why people love it. Make it engaging and informative like a food magazine excerpt.",
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "quantity (optional)",
      "unit": "measurement unit (optional)",
      "isOptional": false
    }
  ],
  "instructions": [
    {
      "stepNumber": 1,
      "instruction": "Detailed step instruction"
    }
  ],
  "nutrition": [
    {
      "nutrientName": "Calories",
      "amount": 250,
      "unit": "kcal"
    },
    {
      "nutrientName": "Protein",
      "amount": 15,
      "unit": "g"
    },
    {
      "nutrientName": "Carbohydrates",
      "amount": 30,
      "unit": "g"
    },
    {
      "nutrientName": "Fat",
      "amount": 8,
      "unit": "g"
    },
    {
      "nutrientName": "Fiber",
      "amount": 5,
      "unit": "g"
    },
    {
      "nutrientName": "Sodium",
      "amount": 400,
      "unit": "mg"
    }
  ],
  "tags": ["tag1", "tag2"],
  "servings": 4,
  "prepTime": {
    "hours": "0",
    "minutes": "15"
  },
  "cookingTime": {
    "hours": "0",
    "minutes": "30"
  }
}

Guidelines:
- Make the recipe practical and achievable
- Include realistic prep and cooking times
- Provide clear, step-by-step instructions
- Include comprehensive nutritional information - provide as many nutrients as are important for the dish (calories, protein, carbs, fat are essential, but also include fiber, sodium, vitamins, minerals, etc. when relevant)
- Add relevant tags (cuisine type, dietary restrictions, etc.)
- Use common ingredients when possible
- Ensure servings make sense for the recipe
- Create rich, engaging descriptions with cultural context and what makes the dish special
- Respond ONLY with the JSON object, no additional text`;

type AIRecipe = z.infer<typeof aiRecipeSchema>;

export const createRecipeWithAgentEvent = "recipe/create-with-agent";

interface RecipeImage {
  url: string;
  smallUrl: string;
  photographer: string;
  photographerUrl: string;
}

export const createRecipeWithAgent = inngest.createFunction(
  {
    id: "create-recipe-with-agent",
    name: "Create Recipe With Agent",
    triggers: [{ event: createRecipeWithAgentEvent }],
  },
  async ({ event, step }) => {
    const { prompt, userId, availableCategories } = event.data;

    const categoryList = availableCategories
      .map(
        (c: { id: string; key: string; name: string }) =>
          `${c.key} (${c.name})`,
      )
      .join(", ");

    const parsedRecipe = await step.run(
      "generate-and-parse-recipe",
      async () => {
        const { text } = await generateText({
          model: groq("llama-3.3-70b-versatile"),
          temperature: 0.1,
          messages: [
            {
              role: "system",
              content: `${RECIPE_GENERATION_PROMPT}

Also include a "categoryKeys" field in your JSON response — pick at most 3 keys from this list that best match the recipe: ${categoryList}
Example: "categoryKeys": ["dinner", "healthy"]
Only use keys from the provided list, no other values.`,
            },
            { role: "user", content: `Create a recipe for: ${prompt}` },
          ],
        });

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [
            null,
            text,
          ];
          parsed = JSON.parse((jsonMatch[1] || text).trim());
        }

        return aiRecipeSchema
          .extend({ categoryKeys: z.array(z.string()).max(3).optional() })
          .parse(parsed);
      },
    );

    const recipeImage = await step.run("fetch-image", () =>
      getRecipeImage(parsedRecipe),
    );

    const createdRecipe = await step.run("save-to-db", () =>
      saveRecipeToDatabase(
        parsedRecipe,
        recipeImage,
        userId,
        availableCategories,
      ),
    );

    return {
      success: true,
      recipeId: createdRecipe.id,
    };
  },
);

async function getRecipeImage(aiRecipe: AIRecipe): Promise<RecipeImage> {
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;
    const searchTerms = [
      aiRecipe.title,
      ...(aiRecipe.tags || []).filter((tag) =>
        ["food", "cuisine", "dish", "meal", "cooking"].some((keyword) =>
          tag.toLowerCase().includes(keyword),
        ),
      ),
      "food",
      "dish",
    ].join(" ");

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerms)}&client_id=${unsplashApiKey}&per_page=10&orientation=landscape`,
    );

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const photos = imageData.results;

      if (photos && photos.length > 0) {
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        return {
          url: randomPhoto.urls.regular,
          smallUrl: randomPhoto.urls.small,
          photographer: randomPhoto.user.name,
          photographerUrl: randomPhoto.user.links.html,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }

  return {
    url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    smallUrl:
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
    photographer: "Fallback",
    photographerUrl: "#",
  };
}

async function saveRecipeToDatabase(
  aiRecipe: AIRecipe & { categoryKeys?: string[] },
  recipeImage: RecipeImage,
  userId: string,
  availableCategories: { id: string; key: string; name: string }[],
) {
  const {
    title,
    description,
    ingredients,
    instructions,
    nutrition,
    tags,
    servings,
    prepTime,
    cookingTime,
  } = aiRecipe;

  const prepTimeMinutes =
    (parseInt(prepTime.hours) || 0) * 60 + (parseInt(prepTime.minutes) || 0);
  const cookTimeMinutes =
    (parseInt(cookingTime.hours) || 0) * 60 +
    (parseInt(cookingTime.minutes) || 0);

  const slug = slugify(title);

  const [createdRecipe] = await nomnomDb
    .insert(recipes)
    .values({
      title,
      slug,
      description,
      imageUrl: recipeImage.url,
      prepTimeMinutes: prepTimeMinutes > 0 ? prepTimeMinutes : undefined,
      cookTimeMinutes: cookTimeMinutes > 0 ? cookTimeMinutes : undefined,
      servings,
      isPublic: true,
      userId,
    })
    .returning();

  const recipeId = createdRecipe.id;

  const matchedCategoryIds = (aiRecipe.categoryKeys ?? [])
    .map((key) => availableCategories.find((c) => c.key === key)?.id)
    .filter(Boolean) as string[];

  await Promise.all([
    ingredients.length > 0 &&
      nomnomDb.insert(recipeIngredients).values(
        ingredients.map((ingredient, index) => ({
          name: ingredient.name,
          amount: ingredient.amount ?? null,
          unit: ingredient.unit ?? null,
          isOptional: ingredient.isOptional,
          orderIndex: index,
          recipeId,
        })),
      ),

    instructions.length > 0 &&
      nomnomDb.insert(recipeInstructions).values(
        instructions.map((instruction) => ({
          stepNumber: instruction.stepNumber,
          instruction: instruction.instruction,
          recipeId,
        })),
      ),

    nutrition &&
      nutrition.length > 0 &&
      nomnomDb.insert(recipeNutrition).values(
        nutrition.map((nutrient) => ({
          nutrientName: nutrient.nutrientName,
          amount: nutrient.amount,
          unit: nutrient.unit,
          recipeId,
        })),
      ),

    tags &&
      tags.length > 0 &&
      nomnomDb.insert(recipeTags).values(
        tags.map((tag) => ({
          name: tag.toLowerCase().trim(),
          recipeId,
        })),
      ),

    matchedCategoryIds.length > 0 &&
      nomnomDb.insert(recipeCategories).values(
        matchedCategoryIds.map((categoryId) => ({
          categoryId,
          recipeId,
        })),
      ),
  ]);

  return createdRecipe;
}
