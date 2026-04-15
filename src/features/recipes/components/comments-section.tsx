import React, { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface BaseComment {
  id: string;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  parentCommentId: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
    profileImageUrl: string | null;
  };
  isLikedByCurrentUser?: boolean;
}

export interface RecipeComment extends BaseComment {
  recipeId: string;
}

export interface BlogComment extends BaseComment {
  blogId: string;
}

export type Comment = RecipeComment | BlogComment;

interface CommentsProps {
  comments: Comment[];
  users?: Record<string, { username: string; profileImageUrl?: string }>;
  currentUserId?: string;
  onLike?: (commentId: string) => void;
  onReply?: (replyText: string, commentId?: string) => void;
  onLoadMore?: () => void;
  onRateAndReview?: (rating: number, reviewText: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onLike?: (commentId: string) => void;
  onReplyClick?: (commentId: string) => void;
  replyingTo?: string | null;
  replyText?: string;
  onReplyTextChange?: (text: string) => void;
  onReplySubmit?: (commentId: string) => void;
  isLastReply?: boolean;
}

interface CommentPostProps {
  rating: number;
  reviewText: string;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (text: string) => void;
  onSubmit: () => void;
  showBackground?: boolean;
}

// Helper function to format timestamp
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

const CommentsSection = ({
  comments,
  users = {},
  onLike,
  onReply,
  onLoadMore,
  onRateAndReview,
}: CommentsProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [visibleComments, setVisibleComments] = useState(2);

  const topLevelComments = comments.filter(
    (comment) => !comment.parentCommentId,
  );

  // Helper function to get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((comment) => comment.parentCommentId === commentId);
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  const handleReplySubmit = (commentId: string) => {
    if (onReply && replyText.trim()) {
      onReply(commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handlePostReview = () => {
    if (onRateAndReview && reviewText.trim() && rating > 0) {
      onRateAndReview(rating, reviewText);
      setRating(0);
      setReviewText("");
    }
  };

  const handleLoadMore = () => {
    if (isAtEnd) {
      // Show less - reset to initial 2 comments
      setVisibleComments(2);
    } else {
      // Load more comments
      setVisibleComments((prev) => prev + 10);
      // If we're about to reach the end of current comments and there might be more, fetch them
      if (visibleComments + 10 >= topLevelComments.length && onLoadMore) {
        onLoadMore();
      }
    }
  };

  const displayedComments = topLevelComments.slice(0, visibleComments);
  const isAtEnd = visibleComments >= topLevelComments.length;

  if (topLevelComments.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>

        <Separator className="my-8" />

        <CommentPost
          rating={rating}
          reviewText={reviewText}
          onRatingChange={setRating}
          onReviewTextChange={setReviewText}
          onSubmit={handlePostReview}
          showBackground={false}
        />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comments List */}
      <div className="space-y-6 mb-6">
        {displayedComments.map((comment, index) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              replies={getReplies(comment.id)}
              users={users}
              onLike={onLike}
              onReplyClick={handleReplyClick}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onReplySubmit={handleReplySubmit}
              isLastReply={getReplies(comment.id).length === 0}
            />
            {index < displayedComments.length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {topLevelComments.length > 2 && (
        <>
          <Separator className="my-8" />
          <div className="flex flex-1 justify-end mb-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="border-primary-200 text-primary-200 hover:text-primary-300 hover:bg-primary-200/20"
            >
              {isAtEnd ? "Show less" : "Load more"}
            </Button>
          </div>
        </>
      )}

      {/* Rate and Review Section */}
      <CommentPost
        rating={rating}
        reviewText={reviewText}
        onRatingChange={setRating}
        onReviewTextChange={setReviewText}
        onSubmit={handlePostReview}
        showBackground={true}
      />
    </div>
  );
};

export default CommentsSection;

const CommentItem = ({
  comment,
  replies,
  users = {},
  isReply = false,
  onLike,
  onReplyClick,
  replyingTo,
  replyText = "",
  onReplyTextChange,
  onReplySubmit,
  isLastReply = false,
}: CommentItemProps & {
  replies?: Comment[];
  users?: Record<string, { username: string; profileImageUrl?: string }>;
}) => {
  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
  };

  const handleReplyClick = () => {
    if (onReplyClick) {
      onReplyClick(comment.id);
    }
  };

  const handleReplySubmit = () => {
    if (onReplySubmit && replyText.trim()) {
      onReplySubmit(comment.id);
    }
  };

  const userInfo = comment.user ||
    users[comment.userId] || {
      username: "Unknown User",
      profileImageUrl: null,
    };

  return (
    <div className={`${isReply ? "ml-12 mt-4" : ""}`}>
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="shrink-0">
          <Image
            src={userInfo.profileImageUrl || "/default-avatar.png"}
            alt={userInfo.username}
            width={100}
            height={100}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {userInfo.username}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimestamp(comment.createdAt)}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          <p className="text-gray-700 mb-3">{comment.content}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-auto p-0 hover:bg-transparent flex items-center gap-1 ${
                comment.isLikedByCurrentUser
                  ? "text-primary-200"
                  : "text-gray-500 hover:text-primary-200"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${comment.isLikedByCurrentUser ? "fill-current" : ""}`}
              />
              <span>{comment.likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="h-auto p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </Button>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => onReplyTextChange?.(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                autoFocus
              />
              <Button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                size="sm"
                className="bg-primary-200 hover:bg-primary-300 text-white"
              >
                Reply
              </Button>
            </div>
          )}

          {!isLastReply && <Separator className="mt-4" />}

          {/* Replies */}
          {replies && replies.length > 0 && (
            <div className="mt-4">
              {replies.map((reply, replyIndex) => (
                <div key={reply.id}>
                  <CommentItem
                    comment={reply}
                    users={users}
                    isReply={true}
                    onLike={onLike}
                    onReplyClick={onReplyClick}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    onReplyTextChange={onReplyTextChange}
                    onReplySubmit={onReplySubmit}
                    isLastReply={replyIndex === replies.length - 1}
                  />
                  {replyIndex < replies.length - 1 && (
                    <Separator className="my-4 ml-12" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentPost = ({
  rating,
  reviewText,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}: CommentPostProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        Rate this recipe and share your opinion
      </h3>

      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            onClick={() => onRatingChange(star)}
            className={`p-0 h-auto hover:bg-transparent ${
              star <= rating
                ? "text-primary-200"
                : "text-gray-300 hover:text-red-300"
            }`}
          >
            <span className="text-2xl">★</span>
          </Button>
        ))}
      </div>

      {/* Review Text Area */}
      <Textarea
        value={reviewText}
        onChange={(e) => onReviewTextChange(e.target.value)}
        placeholder="Type here..."
        rows={4}
        className="mb-4 resize-none border-none focus:ring-1 focus:ring-primary-200 bg-gray-100/90 min-h-32"
      />

      {/* Post Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!reviewText.trim() || rating === 0}
          className="bg-primary-200 hover:bg-primary-300 text-white w-24"
        >
          Post
        </Button>
      </div>
    </div>
  );
};
