import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useCreateCookbook = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.cookbooks.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.cookbooks.getMany.queryOptions({}));
      },
    }),
  );
};

export const useGetCookbooks = (page = 1, pageSize = 12) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.cookbooks.getMany.queryOptions({ page, pageSize }),
  );
};

export const useGetCookbookBySlug = (slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.cookbooks.getBySlug.queryOptions({ slug }),
    retry: false,
  });
};
