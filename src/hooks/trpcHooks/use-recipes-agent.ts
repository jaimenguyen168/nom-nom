import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useCreateRecipeWithAgent = () => {
  const trpc = useTRPC();
  return useMutation(trpc.recipesAgent.createWithAgent.mutationOptions());
};
