import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetReviews = (recipeId: string, page = 1, pageSize = 10) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.recipeReviews.getByRecipe.queryOptions({ recipeId, page, pageSize }),
  );
};

export const useGetReviewStats = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.recipeReviews.getStats.queryOptions({ recipeId }));
};

export const useGetUserReview = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.recipeReviews.getUserReview.queryOptions({ recipeId }));
};

export const useCreateOrUpdateReview = (recipeId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipeReviews.createOrUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipeReviews.getByRecipe.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.recipeReviews.getStats.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.recipeReviews.getUserReview.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useToggleReviewLike = (recipeId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipeReviews.toggleReviewLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipeReviews.getByRecipe.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useCreateReply = (recipeId: string, reviewId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipeReviews.createReply.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipeReviews.getReplies.queryOptions({ reviewId }),
        );
        queryClient.invalidateQueries(
          trpc.recipeReviews.getByRecipe.queryOptions({ recipeId }),
        );
      },
    }),
  );
};

export const useToggleReplyLike = (reviewId: string, recipeId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipeReviews.toggleReplyLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipeReviews.getReplies.queryOptions({ reviewId }),
        );
        queryClient.invalidateQueries(
          trpc.recipeReviews.getByRecipe.queryOptions({ recipeId }),
        );
      },
    }),
  );
};
