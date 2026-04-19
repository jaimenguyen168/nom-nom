import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBlogWithAgent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogsAgent.createWithAgent.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogs.getManyByUser.queryOptions({}),
        );
        queryClient.invalidateQueries(trpc.blogs.getMany.queryOptions({}));
      },
    }),
  );
};
