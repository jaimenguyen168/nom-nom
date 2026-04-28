import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { users } from "@/db/schemas/users";
import { recipes } from "@/db/schemas/recipes";
import { blogs } from "@/db/schemas/blogs";
import { cookbooks, cookbookPurchases } from "@/db/schemas/cookbooks";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getCurrentUser: authProcedure.query(async ({ ctx }) => {
    const user = await nomnomDb
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .then((rows) => rows[0]);

    if (!user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    return user;
  }),

  updateProfile: authProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().optional(),
        username: z.string().min(3).optional(),
        bio: z.string().optional(),
        profileImageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await nomnomDb
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.userId));

      return { success: true };
    }),

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await nomnomDb
        .select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          bio: users.bio,
          profileImageUrl: users.profileImageUrl,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.username, input.username))
        .then((rows) => rows[0]);

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const [recipeCount, blogCount, cookbookCount] = await Promise.all([
        nomnomDb
          .select({ count: count() })
          .from(recipes)
          .where(and(eq(recipes.userId, user.id), eq(recipes.isPublic, true)))
          .then((r) => r[0].count),
        nomnomDb
          .select({ count: count() })
          .from(blogs)
          .where(and(eq(blogs.authorId, user.id), eq(blogs.status, "published")))
          .then((r) => r[0].count),
        nomnomDb
          .select({ count: count() })
          .from(cookbooks)
          .where(and(eq(cookbooks.authorId, user.id), eq(cookbooks.status, "published")))
          .then((r) => r[0].count),
      ]);

      return { ...user, recipeCount, blogCount, cookbookCount };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(50).default(16),
        sortBy: z
          .enum(["newest", "most_recipes", "most_blogs", "most_cookbooks", "top_selling"])
          .default("newest"),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, sortBy } = input;

      // Correlated subquery expressions for counts — avoids cartesian products from multi-joins
      const recipeCountExpr   = sql<number>`(SELECT COUNT(*) FROM "recipes"   WHERE "recipes"."user_id"   = "users"."id" AND "recipes"."is_public" = TRUE)`;
      const blogCountExpr     = sql<number>`(SELECT COUNT(*) FROM "blogs"     WHERE "blogs"."author_id"   = "users"."id" AND "blogs"."status" = 'published')`;
      const cookbookCountExpr = sql<number>`(SELECT COUNT(*) FROM "cookbooks" WHERE "cookbooks"."author_id" = "users"."id" AND "cookbooks"."status" = 'published')`;
      const saleCountExpr     = sql<number>`(SELECT COUNT(*) FROM "cookbook_purchases" cp JOIN "cookbooks" c ON cp.cookbook_id = c.id WHERE c.author_id = "users"."id")`;

      const orderBy = {
        newest:          desc(users.createdAt),
        most_recipes:    desc(recipeCountExpr),
        most_blogs:      desc(blogCountExpr),
        most_cookbooks:  desc(cookbookCountExpr),
        top_selling:     desc(saleCountExpr),
      }[sortBy];

      const data = await nomnomDb
        .select({
          id:              users.id,
          username:        users.username,
          firstName:       users.firstName,
          lastName:        users.lastName,
          bio:             users.bio,
          profileImageUrl: users.profileImageUrl,
          createdAt:       users.createdAt,
          recipeCount:   recipeCountExpr,
          blogCount:     blogCountExpr,
          cookbookCount: cookbookCountExpr,
          saleCount:     saleCountExpr,
        })
        .from(users)
        .where(sql`${users.username} IS NOT NULL`)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(users)
        .where(sql`${users.username} IS NOT NULL`);

      return {
        items: data,
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
        hasMore: page < Math.ceil(totalResult.count / pageSize),
      };
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      return nomnomDb
        .select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        })
        .from(users)
        .where(
          sql`LOWER(${users.username}) LIKE LOWER(${"%" + input.query + "%"})`,
        )
        .limit(5);
    }),
});
