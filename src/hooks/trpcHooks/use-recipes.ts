import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useCreateRecipe = () => {
  const trpc = useTRPC();
  return useMutation(trpc.recipes.create.mutationOptions());
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
