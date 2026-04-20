import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export type RecipeFeedType =
  | "trending"
  | "popular"
  | "new"
  | "a_z"
  | "relevance";

export const useCreateRecipe = () => {
  const trpc = useTRPC();
  return useMutation(trpc.recipes.create.mutationOptions());
};

export const useGetRecipeBySlug = (slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.recipes.getBySlug.queryOptions({ slug }),
    staleTime: 60 * 1000 * 30,
    retry: false,
  });
};

export const useGetRecipe = (username: string, slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.recipes.getByUsernameAndSlug.queryOptions({ username, slug }),
    retry: false,
  });
};

export const useToggleSaveRecipe = (
  recipeId: string,
  username: string,
  slug: string,
) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.recipes.toggleSave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipes.getByUsernameAndSlug.queryOptions({ username, slug }),
        );
        queryClient.invalidateQueries(
          trpc.recipes.isSaved.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.recipes.savesCount.queryOptions({ recipeId }),
        );
        queryClient.invalidateQueries(
          trpc.recipes.getSavedByUser.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.recipes.getManyByUser.queryOptions({}),
        );
      },
    }),
  );

  const handleToggleSave = () => mutate({ recipeId });

  return { handleToggleSave, isPending };
};

export const useIsSavedRecipe = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.recipes.isSaved.queryOptions({ recipeId }));
};

export const useSavesCount = (recipeId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.recipes.savesCount.queryOptions({ recipeId }));
};

export const useRecipeRecommendations = (recipeId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipes.getRecommendations.queryOptions({ recipeId }),
  );
};

export const useGetRecipes = (
  sortBy: RecipeFeedType = "new",
  limit = 12,
  page = 1,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipes.getMany.queryOptions({ sortBy, pageSize: limit, page }),
  );
};

export const useGetRecipesBySameCategories = (recipeId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipes.getBySameCategories.queryOptions({ recipeId }),
  );
};

export const useGetRecipesByCategory = (
  categorySlug: string,
  sortBy: RecipeFeedType = "new",
  pageSize = 12,
  page = 1,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipes.getManyByCategory.queryOptions({
      categorySlug,
      sortBy,
      pageSize,
      page,
    }),
  );
};

export const useUpdateRecipe = (username: string, slug: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipes.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipes.getByUsernameAndSlug.queryOptions({ username, slug }),
        );
      },
    }),
  );
};

export type RecipeStatusFilter = "all" | "public" | "private";

export const useGetMyRecipes = (
  status: RecipeStatusFilter = "all",
  pageSize = 12,
  page = 1,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.recipes.getManyByUser.queryOptions({ status, pageSize, page }),
    refetchInterval: 5000,
  });
};

export const useGetSavedRecipes = (pageSize = 12, page = 1) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipes.getSavedByUser.queryOptions({ pageSize, page }),
  );
};

export const useDeleteRecipe = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.recipes.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipes.getManyByUser.queryOptions({}),
        );
        queryClient.invalidateQueries(trpc.recipes.getMany.queryOptions({}));
      },
    }),
  );
};
