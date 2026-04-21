import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Stats ─────────────────────────────────────────────────────────────────────

export const useGetBlogReviewStats = (blogId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogReviews.getStats.queryOptions({ blogId }));
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const useGetBlogReviews = (blogId: string, page = 1, pageSize = 10) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.blogReviews.getByBlog.queryOptions({ blogId, page, pageSize }),
  );
};

export const useGetUserBlogReview = (blogId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogReviews.getUserReview.queryOptions({ blogId }));
};

export const useCreateOrUpdateBlogReview = (blogId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogReviews.createOrUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogReviews.getByBlog.queryOptions({ blogId }),
        );
        queryClient.invalidateQueries(
          trpc.blogReviews.getStats.queryOptions({ blogId }),
        );
        queryClient.invalidateQueries(
          trpc.blogReviews.getUserReview.queryOptions({ blogId }),
        );
      },
    }),
  );
};

export const useToggleBlogReviewLike = (blogId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogReviews.toggleReviewLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogReviews.getByBlog.queryOptions({ blogId }),
        );
      },
    }),
  );
};

// ── Replies ───────────────────────────────────────────────────────────────────

export const useGetBlogReplies = (reviewId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogReviews.getReplies.queryOptions({ reviewId }));
};

export const useCreateBlogReply = (blogId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogReviews.createReply.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.blogReviews.getByBlog.queryOptions({ blogId }),
        );
        queryClient.invalidateQueries(
          trpc.blogReviews.getReplies.queryOptions({
            reviewId: variables.reviewId,
          }),
        );
        queryClient.invalidateQueries(
          trpc.blogReviews.getStats.queryOptions({ blogId }),
        );
      },
    }),
  );
};

export const useToggleBlogReplyLike = (blogId: string, reviewId?: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogReviews.toggleReplyLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogReviews.getByBlog.queryOptions({ blogId }),
        );
        if (reviewId) {
          queryClient.invalidateQueries(
            trpc.blogReviews.getReplies.queryOptions({ reviewId }),
          );
        }
      },
    }),
  );
};
