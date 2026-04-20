"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { ThumbsUp, MessageCircle, Star, UserCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import AppPagination from "@/components/app-pagination";
import {
  useGetReviews,
  useGetReviewStats,
  useGetUserReview,
  useCreateOrUpdateReview,
  useToggleReviewLike,
  useCreateReply,
  useToggleReplyLike,
} from "@/hooks/trpcHooks/use-recipe-reviews";
import {
  useGetBlogReviews,
  useGetBlogReviewStats,
  useGetUserBlogReview,
  useCreateOrUpdateBlogReview,
  useToggleBlogReplyLike,
  useCreateBlogReply,
} from "@/hooks/trpcHooks/use-blog-reviews";

const PAGE_SIZE = 10;

type Props =
  | { type: "recipe"; recipeId: string }
  | { type: "blog"; blogId: string };

export default function CommentsSection(props: Props) {
  const id = props.type === "recipe" ? props.recipeId : props.blogId;
  return props.type === "recipe" ? (
    <RecipeCommentsSection recipeId={id} />
  ) : (
    <BlogCommentsSection blogId={id} />
  );
}

// ── Recipe ────────────────────────────────────────────────────────────────────

function RecipeCommentsSection({ recipeId }: { recipeId: string }) {
  const { userId } = useAuth();
  const { data: stats } = useGetReviewStats(recipeId);
  const { data: userReview } = useGetUserReview(recipeId);
  const [page, setPage] = useState(1);
  const { data: reviewsData } = useGetReviews(recipeId, page, PAGE_SIZE);
  const createOrUpdate = useCreateOrUpdateReview(recipeId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const reviews = reviewsData?.items ?? [];

  const handleSubmit = async () => {
    if (!rating) return;
    await createOrUpdate.mutateAsync({ recipeId, rating, comment });
    setIsEditing(false);
    setRating(0);
    setComment("");
  };

  const handleEdit = () => {
    setRating(userReview?.rating ?? 0);
    setComment(userReview?.comment ?? "");
    setIsEditing(true);
  };

  return (
    <ReviewsUI
      stats={stats}
      userId={userId}
      userReview={userReview}
      isEditing={isEditing}
      rating={rating}
      hoverRating={hoverRating}
      comment={comment}
      reviews={reviews}
      reviewsData={reviewsData}
      page={page}
      isPending={createOrUpdate.isPending}
      setRating={setRating}
      setComment={setComment}
      setHoverRating={setHoverRating}
      setIsEditing={setIsEditing}
      setPage={setPage}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      renderReview={(review, isLast) => (
        <RecipeReviewItem
          key={review.id}
          review={review}
          recipeId={recipeId}
          currentUserId={userId}
          isOwn={review.userId === userId}
          onEdit={handleEdit}
          isLast={isLast}
        />
      )}
    />
  );
}

// ── Blog ──────────────────────────────────────────────────────────────────────

function BlogCommentsSection({ blogId }: { blogId: string }) {
  const { userId } = useAuth();
  const { data: stats } = useGetBlogReviewStats(blogId);
  const { data: userReview } = useGetUserBlogReview(blogId);
  const [page, setPage] = useState(1);
  const { data: reviewsData } = useGetBlogReviews(blogId, page, PAGE_SIZE);
  const createOrUpdate = useCreateOrUpdateBlogReview(blogId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const reviews = reviewsData?.items ?? [];

  const handleSubmit = async () => {
    if (!rating) return;
    await createOrUpdate.mutateAsync({ blogId, rating, comment });
    setIsEditing(false);
    setRating(0);
    setComment("");
  };

  const handleEdit = () => {
    setRating(userReview?.rating ?? 0);
    setComment(userReview?.comment ?? "");
    setIsEditing(true);
  };

  return (
    <ReviewsUI
      stats={stats}
      userId={userId}
      userReview={userReview}
      isEditing={isEditing}
      rating={rating}
      hoverRating={hoverRating}
      comment={comment}
      reviews={reviews}
      reviewsData={reviewsData}
      page={page}
      isPending={createOrUpdate.isPending}
      setRating={setRating}
      setComment={setComment}
      setHoverRating={setHoverRating}
      setIsEditing={setIsEditing}
      setPage={setPage}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      renderReview={(review, isLast) => (
        <BlogReviewItem
          key={review.id}
          review={review}
          blogId={blogId}
          currentUserId={userId}
          isOwn={review.userId === userId}
          onEdit={handleEdit}
          isLast={isLast}
        />
      )}
    />
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

type ReviewBase = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  userId: string;
  username: string | null;
  profileImageUrl: string | null;
  likesCount: number;
  isLiked: boolean;
  replies: ReplyBase[];
};

type ReplyBase = {
  id: string;
  content: string;
  createdAt: Date | null;
  userId: string;
  username: string | null;
  profileImageUrl: string | null;
  likesCount: number;
  isLiked: boolean;
};

function ReviewsUI({
  stats,
  userId,
  userReview,
  isEditing,
  rating,
  hoverRating,
  comment,
  reviews,
  reviewsData,
  page,
  isPending,
  setRating,
  setComment,
  setHoverRating,
  setIsEditing,
  setPage,
  onSubmit,
  onEdit,
  renderReview,
}: {
  stats: { avgRating: number; totalReviews: number } | undefined | null;
  userId: string | null | undefined;
  userReview: { rating: number; comment?: string | null } | null | undefined;
  isEditing: boolean;
  rating: number;
  hoverRating: number;
  comment: string;
  reviews: ReviewBase[];
  reviewsData: { items: ReviewBase[]; totalPages: number } | undefined | null;
  page: number;
  isPending: boolean;
  setRating: (v: number) => void;
  setComment: (v: string) => void;
  setHoverRating: (v: number) => void;
  setIsEditing: (v: boolean) => void;
  setPage: (v: number) => void;
  onSubmit: () => void;
  onEdit: () => void;
  renderReview: (review: ReviewBase, isLast: boolean) => React.ReactNode;
}) {
  return (
    <div className="mb-8 space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>

      {(stats?.totalReviews ?? 0) > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">
            {stats?.avgRating?.toFixed(1)}
          </span>
          <div>
            <StarRow rating={stats?.avgRating ?? 0} size="md" />
            <p className="text-sm text-gray-500">
              {stats?.totalReviews} reviews
            </p>
          </div>
        </div>
      )}

      <Separator />

      {userId && (!userReview || isEditing) && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`size-7 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-primary-200 text-primary-200"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="resize-none min-h-24 bg-gray-50"
          />
          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button
              onClick={onSubmit}
              disabled={!rating || isPending}
              className="bg-primary-200 hover:bg-primary-300 text-white"
            >
              {isPending ? "Posting..." : isEditing ? "Update" : "Post Review"}
            </Button>
          </div>
          <Separator />
        </div>
      )}

      {!reviewsData ? null : reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((review) =>
              renderReview(
                review,
                review.id === reviews[reviews.length - 1].id,
              ),
            )}
          </div>
          {(reviewsData.totalPages ?? 1) > 1 && (
            <AppPagination
              currentPage={page}
              totalPages={reviewsData.totalPages ?? 1}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

// ── Recipe Review Item ────────────────────────────────────────────────────────

function RecipeReviewItem({
  review,
  recipeId,
  currentUserId,
  isOwn,
  onEdit,
  isLast,
}: {
  review: ReviewBase;
  recipeId: string;
  currentUserId: string | null | undefined;
  isOwn?: boolean;
  onEdit?: () => void;
  isLast?: boolean;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const toggleLike = useToggleReviewLike(recipeId);
  const createReply = useCreateReply(recipeId, review.id);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await createReply.mutateAsync({
      recipeId,
      reviewId: review.id,
      content: replyText,
    });
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <ReviewItemUI
      review={review}
      currentUserId={currentUserId}
      isOwn={isOwn}
      onEdit={onEdit}
      isLast={isLast}
      replyText={replyText}
      showReplyInput={showReplyInput}
      isReplyPending={createReply.isPending}
      isLikePending={toggleLike.isPending}
      setReplyText={setReplyText}
      setShowReplyInput={setShowReplyInput}
      onLike={() => toggleLike.mutate({ reviewId: review.id })}
      onReply={handleReply}
      renderReplyItem={(reply) => (
        <RecipeReplyItem
          key={reply.id}
          reply={reply}
          reviewId={review.id}
          currentUserId={currentUserId}
        />
      )}
    />
  );
}

// ── Blog Review Item ──────────────────────────────────────────────────────────

function BlogReviewItem({
  review,
  blogId,
  currentUserId,
  isOwn,
  onEdit,
  isLast,
}: {
  review: ReviewBase;
  blogId: string;
  currentUserId: string | null | undefined;
  isOwn?: boolean;
  onEdit?: () => void;
  isLast?: boolean;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const createReply = useCreateBlogReply(blogId);
  const toggleReplyLike = useToggleBlogReplyLike(blogId);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await createReply.mutateAsync({
      blogId,
      reviewId: review.id,
      content: replyText,
    });
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <ReviewItemUI
      review={review}
      currentUserId={currentUserId}
      isOwn={isOwn}
      onEdit={onEdit}
      isLast={isLast}
      replyText={replyText}
      showReplyInput={showReplyInput}
      isReplyPending={createReply.isPending}
      isLikePending={false}
      setReplyText={setReplyText}
      setShowReplyInput={setShowReplyInput}
      onLike={() => {}} // add blogReviewLikes table to enable this
      onReply={handleReply}
      renderReplyItem={(reply) => (
        <BlogReplyItem
          key={reply.id}
          reply={reply}
          blogId={blogId}
          currentUserId={currentUserId}
        />
      )}
    />
  );
}

// ── Shared Review Item UI ─────────────────────────────────────────────────────

function ReviewItemUI({
  review,
  currentUserId,
  isOwn,
  onEdit,
  isLast,
  replyText,
  showReplyInput,
  isReplyPending,
  isLikePending,
  setReplyText,
  setShowReplyInput,
  onLike,
  onReply,
  renderReplyItem,
}: {
  review: ReviewBase;
  currentUserId: string | null | undefined;
  isOwn?: boolean;
  onEdit?: () => void;
  isLast?: boolean;
  replyText: string;
  showReplyInput: boolean;
  isReplyPending: boolean;
  isLikePending: boolean;
  setReplyText: (v: string) => void;
  setShowReplyInput: (v: boolean) => void;
  onLike: () => void;
  onReply: () => void;
  renderReplyItem: (reply: ReplyBase) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="shrink-0">
          {review.profileImageUrl ? (
            <Image
              src={review.profileImageUrl}
              alt={review.username ?? ""}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="size-10 text-gray-400" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.username}</span>
              {isOwn && (
                <span className="text-xs text-primary-200 font-medium">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isOwn && onEdit && (
                <button
                  onClick={onEdit}
                  className="text-xs text-gray-400 hover:text-primary-200 transition-colors underline"
                >
                  Edit
                </button>
              )}
              <span className="text-xs text-gray-400">
                {review.createdAt
                  ? formatDate(review.createdAt.toISOString())
                  : ""}
              </span>
            </div>
          </div>

          <StarRow rating={review.rating} size="sm" />

          {review.comment && (
            <p className="text-gray-700 text-sm">{review.comment}</p>
          )}

          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={onLike}
              disabled={!currentUserId || isLikePending}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                review.isLiked
                  ? "text-primary-200"
                  : "text-gray-400 hover:text-primary-200"
              }`}
            >
              <ThumbsUp
                className={`size-4 ${review.isLiked ? "fill-current" : ""}`}
              />
              <span>{review.likesCount} Helpful</span>
            </button>

            {currentUserId && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-200 transition-colors"
              >
                <MessageCircle className="size-4" />
                Reply
              </button>
            )}
          </div>

          {review.replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
              {review.replies.map((reply) => renderReplyItem(reply))}
            </div>
          )}

          {showReplyInput && (
            <div className="flex gap-2 mt-3">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="resize-none min-h-16 text-sm bg-gray-50"
                rows={2}
                autoFocus
              />
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  size="sm"
                  onClick={onReply}
                  disabled={!replyText.trim() || isReplyPending}
                  className="bg-primary-200 hover:bg-primary-300 text-white"
                >
                  {isReplyPending ? "..." : "Send"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isLast && <Separator className="my-4" />}
    </div>
  );
}

// ── Recipe Reply Item ─────────────────────────────────────────────────────────

function RecipeReplyItem({
  reply,
  reviewId,
  currentUserId,
}: {
  reply: ReplyBase;
  reviewId: string;
  currentUserId: string | null | undefined;
}) {
  const toggleLike = useToggleReplyLike(reviewId);
  return (
    <ReplyItemUI
      reply={reply}
      currentUserId={currentUserId}
      isLikePending={toggleLike.isPending}
      onLike={() => toggleLike.mutate({ commentId: reply.id })}
    />
  );
}

// ── Blog Reply Item ───────────────────────────────────────────────────────────

function BlogReplyItem({
  reply,
  blogId,
  currentUserId,
}: {
  reply: ReplyBase;
  blogId: string;
  currentUserId: string | null | undefined;
}) {
  const toggleLike = useToggleBlogReplyLike(blogId);
  return (
    <ReplyItemUI
      reply={reply}
      currentUserId={currentUserId}
      isLikePending={toggleLike.isPending}
      onLike={() => toggleLike.mutate({ commentId: reply.id })}
    />
  );
}

// ── Shared Reply Item UI ──────────────────────────────────────────────────────

function ReplyItemUI({
  reply,
  currentUserId,
  isLikePending,
  onLike,
}: {
  reply: ReplyBase;
  currentUserId: string | null | undefined;
  isLikePending: boolean;
  onLike: () => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        {reply.profileImageUrl ? (
          <Image
            src={reply.profileImageUrl}
            alt={reply.username ?? ""}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="size-8 text-gray-400" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{reply.username}</span>
          <span className="text-xs text-gray-400">
            {reply.createdAt ? formatDate(reply.createdAt.toISOString()) : ""}
          </span>
        </div>
        <p className="text-gray-700 text-sm">{reply.content}</p>
        <button
          onClick={onLike}
          disabled={!currentUserId || isLikePending}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            reply.isLiked
              ? "text-primary-200"
              : "text-gray-400 hover:text-primary-200"
          }`}
        >
          <ThumbsUp
            className={`size-3.5 ${reply.isLiked ? "fill-current" : ""}`}
          />
          <span>{reply.likesCount} Helpful</span>
        </button>
      </div>
    </div>
  );
}

// ── Star Row ──────────────────────────────────────────────────────────────────

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "md" ? "size-5" : "size-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating)
              ? "fill-primary-200 text-primary-200"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
