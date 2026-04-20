import { authProcedure, createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { nomnomDb } from "@/db";
import {
  recipeCommentLikes,
  recipeComments,
  recipeReviewLikes,
  recipeReviews,
} from "@/db/schemas/recipes";
import { users } from "@/db/schemas/users";
import { and, avg, count, desc, eq, inArray } from "drizzle-orm";

export const reviewsRouter = createTRPCRouter({
  getByRecipe: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { recipeId, page, pageSize } = input;

      const reviewsData = await nomnomDb
        .select({
          id: recipeReviews.id,
          rating: recipeReviews.rating,
          comment: recipeReviews.comment,
          createdAt: recipeReviews.createdAt,
          userId: recipeReviews.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(recipeReviews)
        .leftJoin(users, eq(recipeReviews.userId, users.id))
        .where(eq(recipeReviews.recipeId, recipeId))
        .orderBy(desc(recipeReviews.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await nomnomDb
        .select({ count: count() })
        .from(recipeReviews)
        .where(eq(recipeReviews.recipeId, recipeId));

      if (reviewsData.length === 0) {
        return { items: [], total: 0, totalPages: 0 };
      }

      const reviewIds = reviewsData.map((r) => r.id);

      const reviewLikeCounts = await nomnomDb
        .select({
          reviewId: recipeReviewLikes.reviewId,
          likesCount: count(recipeReviewLikes.id),
        })
        .from(recipeReviewLikes)
        .where(inArray(recipeReviewLikes.reviewId, reviewIds))
        .groupBy(recipeReviewLikes.reviewId);

      const likedReviewIds = ctx.userId
        ? (
            await nomnomDb
              .select({ reviewId: recipeReviewLikes.reviewId })
              .from(recipeReviewLikes)
              .where(
                and(
                  eq(recipeReviewLikes.userId, ctx.userId),
                  inArray(recipeReviewLikes.reviewId, reviewIds),
                ),
              )
          ).map((r) => r.reviewId)
        : [];

      const repliesData = await nomnomDb
        .select({
          id: recipeComments.id,
          content: recipeComments.content,
          createdAt: recipeComments.createdAt,
          userId: recipeComments.userId,
          reviewId: recipeComments.reviewId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        })
        .from(recipeComments)
        .leftJoin(users, eq(recipeComments.userId, users.id))
        .where(inArray(recipeComments.reviewId, reviewIds))
        .orderBy(desc(recipeComments.createdAt));

      const replyIds = repliesData.map((r) => r.id);

      const replyLikeCounts =
        replyIds.length > 0
          ? await nomnomDb
              .select({
                commentId: recipeCommentLikes.commentId,
                likesCount: count(recipeCommentLikes.id),
              })
              .from(recipeCommentLikes)
              .where(inArray(recipeCommentLikes.commentId, replyIds))
              .groupBy(recipeCommentLikes.commentId)
          : [];

      const likedCommentIds =
        ctx.userId && replyIds.length > 0
          ? (
              await nomnomDb
                .select({ commentId: recipeCommentLikes.commentId })
                .from(recipeCommentLikes)
                .where(
                  and(
                    eq(recipeCommentLikes.userId, ctx.userId),
                    inArray(recipeCommentLikes.commentId, replyIds),
                  ),
                )
            ).map((r) => r.commentId)
          : [];

      return {
        items: reviewsData.map((review) => ({
          ...review,
          likesCount:
            reviewLikeCounts.find((l) => l.reviewId === review.id)
              ?.likesCount ?? 0,
          isLiked: likedReviewIds.includes(review.id),
          replies: repliesData
            .filter((r) => r.reviewId === review.id)
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
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ input }) => {
      const [result] = await nomnomDb
        .select({
          avgRating: avg(recipeReviews.rating),
          totalReviews: count(recipeReviews.id),
        })
        .from(recipeReviews)
        .where(eq(recipeReviews.recipeId, input.recipeId));

      return {
        avgRating: result.avgRating ? parseFloat(result.avgRating) : 0,
        totalReviews: result.totalReviews,
      };
    }),

  getUserReview: authProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return nomnomDb
        .select()
        .from(recipeReviews)
        .where(
          and(
            eq(recipeReviews.recipeId, input.recipeId),
            eq(recipeReviews.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0] ?? null);
    }),

  createOrUpdate: authProcedure
    .input(
      z.object({
        recipeId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(recipeReviews)
        .where(
          and(
            eq(recipeReviews.recipeId, input.recipeId),
            eq(recipeReviews.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .update(recipeReviews)
          .set({
            rating: input.rating,
            comment: input.comment,
            updatedAt: new Date(),
          })
          .where(eq(recipeReviews.id, existing.id));

        return { id: existing.id };
      }

      const [created] = await nomnomDb
        .insert(recipeReviews)
        .values({
          recipeId: input.recipeId,
          userId: ctx.userId,
          rating: input.rating,
          comment: input.comment,
        })
        .returning();

      return { id: created.id };
    }),

  toggleReviewLike: authProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(recipeReviewLikes)
        .where(
          and(
            eq(recipeReviewLikes.reviewId, input.reviewId),
            eq(recipeReviewLikes.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(recipeReviewLikes)
          .where(eq(recipeReviewLikes.id, existing.id));
        return { isLiked: false };
      }

      await nomnomDb
        .insert(recipeReviewLikes)
        .values({ reviewId: input.reviewId, userId: ctx.userId });

      return { isLiked: true };
    }),

  // ── Replies ───────────────────────────────────────────────

  getReplies: publicProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await nomnomDb
        .select({
          id: recipeComments.id,
          content: recipeComments.content,
          createdAt: recipeComments.createdAt,
          updatedAt: recipeComments.updatedAt,
          userId: recipeComments.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          likesCount: count(recipeCommentLikes.id).as("likesCount"),
        })
        .from(recipeComments)
        .leftJoin(users, eq(recipeComments.userId, users.id))
        .leftJoin(
          recipeCommentLikes,
          eq(recipeCommentLikes.commentId, recipeComments.id),
        )
        .where(eq(recipeComments.reviewId, input.reviewId))
        .groupBy(recipeComments.id, users.username, users.profileImageUrl)
        .orderBy(desc(recipeComments.createdAt));

      const likedCommentIds = ctx.userId
        ? (
            await nomnomDb
              .select({ commentId: recipeCommentLikes.commentId })
              .from(recipeCommentLikes)
              .where(eq(recipeCommentLikes.userId, ctx.userId))
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
        recipeId: z.string(),
        reviewId: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await nomnomDb
        .insert(recipeComments)
        .values({
          recipeId: input.recipeId,
          userId: ctx.userId,
          content: input.content,
          reviewId: input.reviewId,
        })
        .returning();

      return created;
    }),

  toggleReplyLike: authProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await nomnomDb
        .select()
        .from(recipeCommentLikes)
        .where(
          and(
            eq(recipeCommentLikes.commentId, input.commentId),
            eq(recipeCommentLikes.userId, ctx.userId),
          ),
        )
        .then((rows) => rows[0]);

      if (existing) {
        await nomnomDb
          .delete(recipeCommentLikes)
          .where(eq(recipeCommentLikes.id, existing.id));
        return { isLiked: false };
      }

      await nomnomDb
        .insert(recipeCommentLikes)
        .values({ commentId: input.commentId, userId: ctx.userId });

      return { isLiked: true };
    }),
});
