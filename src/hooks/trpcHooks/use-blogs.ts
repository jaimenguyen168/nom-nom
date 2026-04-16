import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useCreateBlog = () => {
  const trpc = useTRPC();
  return useMutation(trpc.blogs.create.mutationOptions());
};
