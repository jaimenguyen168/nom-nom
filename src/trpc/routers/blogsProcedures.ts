import { createTRPCRouter, authProcedure } from "@/trpc/init";
import { blogs, blogTags } from "@/db/schemas/blogs";
import { users } from "@/db/schemas/users";
import { nomnomDb } from "@/db";
import { eq } from "drizzle-orm";
import { createBlogSchema } from "@/db/schemas/blogs";
import { slugify } from "@/lib/utils";

export const blogsRouter = createTRPCRouter({
  create: authProcedure
    .input(createBlogSchema)
    .mutation(async ({ ctx, input }) => {
      const [blog] = await nomnomDb
        .insert(blogs)
        .values({
          title: input.title,
          slug: input.slug || slugify(input.title),
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          topic: input.topic,
          contentBlocks: input.contentBlocks,
          status: input.status,
          authorId: ctx.userId,
          publishedAt: input.status === "published" ? new Date() : null,
        })
        .returning();

      if (input.tags && input.tags.length > 0) {
        await nomnomDb.insert(blogTags).values(
          input.tags.map((tag) => ({
            name: tag.name,
            blogId: blog.id,
          })),
        );
      }

      const user = await nomnomDb
        .select()
        .from(users)
        .where(eq(users.id, ctx.userId))
        .then((rows) => rows[0]);

      return { username: user.username, blogSlug: blog.slug };
    }),
});
