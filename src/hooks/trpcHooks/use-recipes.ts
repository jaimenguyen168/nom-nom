import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

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
