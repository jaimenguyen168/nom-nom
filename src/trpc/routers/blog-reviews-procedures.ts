import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import {
  blogCommentLikes,
  blogComments,
  blogReviews,
} from "@/db/schemas/blogs";
import { users } from "@/db/schemas/users";
import { and, avg, count, desc, eq, inArray } from "drizzle-orm";

export const blogReviewsRouter = createTRPCRouter({
  getByBlog: publicProcedure
    .input(
      z.object({
        blogId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { blogId, page, pageSize } = input;

      const reviewsData = await nomnomDb
        .select({
          id: blogReviews.id,
          rating: blogReviews.rating,
          comment: blogReviews.comment,
          createdAt: blogReviews.createdAt,
          userId: blogReviews.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(blogReviews)
        .leftJoin(users, eq(blogReviews.userId, users.id))
        .where(eq(blogReviews.blogId, blogId))
        .orderBy(desc(blogReviews.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(blogReviews)
        .where(eq(blogReviews.blogId, blogId));

      if (reviewsData.length === 0) {
        return { items: [], total: 0, totalPages: 0 };
      }

      const reviewIds = reviewsData.map((r) => r.id);

      // Fetch replies (blogComments with parentCommentId = reviewId)
      const repliesData = await nomnomDb
        .select({
          id: blogComments.id,
          content: blogComments.content,
          createdAt: blogComments.createdAt,
          userId: blogComments.userId,
          parentCommentId: blogComments.parentCommentId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(blogComments)
        .leftJoin(users, eq(blogComments.userId, users.id))
        .where(inArray(blogComments.parentCommentId, reviewIds))
        .orderBy(desc(blogComments.createdAt));

      const replyIds = repliesData.map((r) => r.id);

      const replyLikeCounts =
        replyIds.length > 0
          ? await nomnomDb
              .select({
                commentId: blogCommentLikes.commentId,
                likesCount: count(blogCommentLikes.id),
              })
              .from(blogCommentLikes)
              .where(inArray(blogCommentLikes.commentId, replyIds))
              .groupBy(blogCommentLikes.commentId)
          : [];

      const likedCommentIds =
        ctx.userId && replyIds.length > 0
          ? (
              await nomnomDb
                .select({ commentId: blogCommentLikes.commentId })
                .from(blogCommentLikes)
                .where(
                  and(
                    eq(blogCommentLikes.userId, ctx.userId),
                    inArray(blogCommentLikes.commentId, replyIds),
                  ),
                )
            ).map((r) => r.commentId)
          : [];

      return {
        items: reviewsData.map((review) => ({
          ...review,
          likesCount: 0, // add blogReviewLikes table if you want this
          isLiked: false,
          replies: repliesData
            .filter((r) => r.parentCommentId === review.id)
            .map((reply) => ({
              ...reply,
              likesCount:
                replyLikeCounts.find((l) => l.commentId === reply.id)
                  ?.likesCount ?? 0,
              isLiked: likedCommentIds.includes(reply.id),
            })),
        })),
        total: totalResult.count,
        totalPages: Math.ceil(totalResult.count / pageSize),
      };
    }),

  getStats: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const [[reviewResult], [commentResult]] = await Promise.all([
        nomnomDb
          .select({
            avgRating: avg(blogReviews.rating),
            totalReviews: count(blogReviews.id),
          })
          .from(blogReviews)
          .where(eq(blogReviews.blogId, input.blogId)),

        nomnomDb
          .select({
            totalComments: count(blogComments.id),
          })
          .from(blogComments)
          .where(eq(blogComments.blogId, input.blogId)),
      ]);

      return {
        avgRating: reviewResult.avgRating
          ? parseFloat(reviewResult.avgRating)
          : 0,
        totalReviews: reviewResult.totalReviews,
        totalComments: reviewResult.totalReviews + commentResult.totalComments,
      };
    }),

  getUserReview: authProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ ctx, input }) => {
      return nomnomDb
        .select()
        .from(blogReviews)
        .where(
          and(
            eq(blogReviews.blogId, input.blogId),
            eq(blogReviews.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0] ?? null);
    }),

  createOrUpdate: authProcedure
    .input(
      z.object({
        blogId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(blogReviews)
        .where(
          and(
            eq(blogReviews.blogId, input.blogId),
            eq(blogReviews.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .update(blogReviews)
          .set({
            rating: input.rating,
            comment: input.comment,
            updatedAt: new Date(),
          })
          .where(eq(blogReviews.id, existing.id));

        return { id: existing.id };
      }

      const [created] = await nomnomDb
        .insert(blogReviews)
        .values({
          blogId: input.blogId,
          userId: ctx.userId,
          rating: input.rating,
          comment: input.comment,
        })
        .returning();

      return { id: created.id };
    }),

  // ── Replies ───────────────────────────────────────────────

  getReplies: publicProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await nomnomDb
        .select({
          id: blogComments.id,
          content: blogComments.content,
          createdAt: blogComments.createdAt,
          updatedAt: blogComments.updatedAt,
          userId: blogComments.userId,
          parentCommentId: blogComments.parentCommentId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          likesCount: count(blogCommentLikes.id).as("likesCount"),
        })
        .from(blogComments)
        .leftJoin(users, eq(blogComments.userId, users.id))
        .leftJoin(
          blogCommentLikes,
          eq(blogCommentLikes.commentId, blogComments.id),
        )
        .where(eq(blogComments.parentCommentId, input.reviewId))
        .groupBy(blogComments.id, users.username, users.profileImageUrl)
        .orderBy(desc(blogComments.createdAt));

      const likedCommentIds = ctx.userId
        ? (
            await nomnomDb
              .select({ commentId: blogCommentLikes.commentId })
              .from(blogCommentLikes)
              .where(eq(blogCommentLikes.userId, ctx.userId))
          ).map((r) => r.commentId)
        : [];

      return data.map((r) => ({
        ...r,
        isLiked: likedCommentIds.includes(r.id),
      }));
    }),

  createReply: authProcedure
    .input(
      z.object({
        blogId: z.string(),
        reviewId: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await nomnomDb
        .insert(blogComments)
        .values({
          blogId: input.blogId,
          userId: ctx.userId,
          content: input.content,
          parentCommentId: input.reviewId,
        })
        .returning();

      return created;
    }),

  toggleReplyLike: authProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(blogCommentLikes)
        .where(
          and(
            eq(blogCommentLikes.commentId, input.commentId),
            eq(blogCommentLikes.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(blogCommentLikes)
          .where(eq(blogCommentLikes.id, existing.id));
        return { isLiked: false };
      }

      await nomnomDb
        .insert(blogCommentLikes)
        .values({ commentId: input.commentId, userId: ctx.userId });

      return { isLiked: true };
    }),
});
