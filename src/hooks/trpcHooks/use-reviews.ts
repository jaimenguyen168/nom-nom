import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetReviews = (recipeId: string, page = 1, pageSize = 10) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.reviews.getByRecipe.queryOptions({ recipeId, page, pageSize }),
  );
};

export const useGetReviewStats = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.reviews.getStats.queryOptions({ recipeId }));
};

export const useGetUserReview = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.reviews.getUserReview.queryOptions({ recipeId }));
};

export const useCreateOrUpdateReview = (recipeId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.createOrUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getByRecipe.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.reviews.getStats.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.reviews.getUserReview.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useToggleReviewLike = (recipeId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.toggleReviewLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getByRecipe.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useCreateReply = (recipeId: string, reviewId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.createReply.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getReplies.queryOptions({ reviewId }),
        );
        queryClient.invalidateQueries(
          trpc.reviews.getByRecipe.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useToggleReplyLike = (reviewId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.toggleReplyLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getReplies.queryOptions({ reviewId }),
        );
      },
    }),
  );
};
