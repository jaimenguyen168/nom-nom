import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useCreateRecipe = () => {
  const trpc = useTRPC();

  return useMutation(trpc.recipes.create.mutationOptions());
};
