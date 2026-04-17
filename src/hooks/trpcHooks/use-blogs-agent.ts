import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useCreateBlogWithAgent = () => {
  const trpc = useTRPC();
  return useMutation(trpc.blogsAgent.createWithAgent.mutationOptions());
};
