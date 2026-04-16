import { inngest } from "./client";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { nomnomDb } from "@/db";
import { blogs, blogTags, blogCategories } from "@/db/schemas/blogs";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const aiBlogSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  topic: z.string(),
  contentBlocks: z.array(
    z.union([
      z.object({ type: z.literal("paragraph"), value: z.string() }),
      z.object({
        type: z.literal("heading"),
        value: z.string(),
        level: z.number().min(1).max(6),
      }),
      z.object({
        type: z.literal("quote"),
        value: z.string(),
        author: z.string().optional(),
      }),
      z.object({
        type: z.literal("list"),
        value: z.string(),
        items: z.array(z.string()),
      }),
    ]),
  ),
  tags: z.array(z.string()).optional(),
  categoryKeys: z.array(z.string()).max(3).optional(),
});

type AIBlog = z.infer<typeof aiBlogSchema>;

export const createBlogWithAgentEvent = "blog/create-with-agent";

const BLOG_GENERATION_PROMPT = `You are an expert food writer and blogger with deep knowledge of global cuisines, cooking techniques, and food culture. Create a detailed, engaging blog post based on the user's request.

You must respond with ONLY a valid JSON object with the following structure (no markdown, no extra text):

{
  "title": "Blog post title",
  "excerpt": "A compelling 1-2 sentence summary that will appear in blog previews",
  "topic": "Main topic keyword (e.g., dessert, breakfast, cocktail)",
  "contentBlocks": [
    { "type": "paragraph", "value": "Your paragraph text here" },
    { "type": "heading", "level": 2, "value": "Section heading" },
    { "type": "quote", "value": "An inspiring quote", "author": "Quote author" },
    { "type": "list", "value": "", "items": ["item 1", "item 2", "item 3"] }
  ],
  "tags": ["tag1", "tag2", "tag3"],
  "categoryKeys": ["dessert", "healthy"]
}

Guidelines:
- Write in an engaging, conversational food blog style
- Include at least 4-6 content blocks with a mix of paragraphs, headings, and lists
- Start with an engaging introduction paragraph
- Use headings to break up sections
- Include practical tips, cultural context, or interesting facts
- Add a list block for tips, ingredients overview, or key points
- End with a compelling conclusion paragraph
- Tags should be relevant keywords (cuisine, dietary, occasion, etc.)
- Respond ONLY with the JSON object, no additional text`;

export const createBlogWithAgent = inngest.createFunction(
  {
    id: "create-blog-with-agent",
    name: "Create Blog With Agent",
    triggers: [{ event: createBlogWithAgentEvent }],
  },
  async ({ event, step }) => {
    const { prompt, userId, availableCategories } = event.data;

    const categoryList = availableCategories
      .map(
        (c: { id: string; key: string; name: string }) =>
          `${c.key} (${c.name})`,
      )
      .join(", ");

    const parsedBlog = await step.run("generate-and-parse-blog", async () => {
      console.log("=== BLOG STEP STARTING ===");

      const { text } = await generateText({
        model: openai("gpt-4o"),
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `${BLOG_GENERATION_PROMPT}

Pick at most 3 categoryKeys from this list: ${categoryList}
Only use keys from the provided list.`,
          },
          { role: "user", content: `Write a blog post about: ${prompt}` },
        ],
      });

      console.log("=== BLOG CONTENT ===", text?.slice(0, 100));

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

      return aiBlogSchema.parse(parsed);
    });

    const featuredImage = await step.run("fetch-image", () =>
      getBlogImage(parsedBlog),
    );

    const createdBlog = await step.run("save-to-db", () =>
      saveBlogToDatabase(
        parsedBlog,
        featuredImage,
        userId,
        availableCategories,
      ),
    );

    return {
      success: true,
      blogId: createdBlog.id,
      blogSlug: createdBlog.slug,
    };
  },
);

async function getBlogImage(blog: AIBlog): Promise<string> {
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;
    const searchTerms = `${blog.topic} food`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerms)}&client_id=${unsplashApiKey}&per_page=10&orientation=landscape`,
    );

    if (response.ok) {
      const data = await response.json();
      const photos = data.results;
      if (photos?.length > 0) {
        const photo = photos[Math.floor(Math.random() * photos.length)];
        return photo.urls.regular;
      }
    }
  } catch (error) {
    console.error("Error fetching blog image:", error);
  }

  return "https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
}

async function saveBlogToDatabase(
  aiBlog: AIBlog,
  featuredImage: string,
  userId: string,
  availableCategories: { id: string; key: string; name: string }[],
) {
  const slug = slugify(aiBlog.title) + "-" + Date.now();

  const [createdBlog] = await nomnomDb
    .insert(blogs)
    .values({
      title: aiBlog.title,
      slug,
      excerpt: aiBlog.excerpt,
      featuredImage,
      topic: aiBlog.topic,
      contentBlocks: aiBlog.contentBlocks,
      status: "published",
      publishedAt: new Date(),
      authorId: userId,
    })
    .returning();

  const blogId = createdBlog.id;

  const matchedCategoryIds = (aiBlog.categoryKeys ?? [])
    .map((key) => availableCategories.find((c) => c.key === key)?.id)
    .filter(Boolean) as string[];

  await Promise.all([
    aiBlog.tags &&
      aiBlog.tags.length > 0 &&
      nomnomDb.insert(blogTags).values(
        aiBlog.tags.map((tag) => ({
          name: tag.toLowerCase().trim(),
          blogId,
        })),
      ),

    matchedCategoryIds.length > 0 &&
      nomnomDb.insert(blogCategories).values(
        matchedCategoryIds.map((categoryId) => ({
          categoryId,
          blogId,
        })),
      ),
  ]);

  return createdBlog;
}
