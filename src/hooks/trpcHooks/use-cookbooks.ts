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
        queryClient.invalidateQueries(
          trpc.cookbooks.getManyByUser.queryOptions({}),
        );
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

export const useGetSavedCookbooks = (pageSize = 12, page = 1) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.cookbooks.getSavedByUser.queryOptions({ pageSize, page }),
  );
};

export const useGetMyCookbooks = (
  status: "all" | "draft" | "published" | "archived" = "all",
  page = 1,
  pageSize = 12,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.cookbooks.getManyByUser.queryOptions({ status, page, pageSize }),
  );
};

export const useToggleSaveCookbook = (slug: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.cookbooks.toggleSave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.cookbooks.getBySlug.queryOptions({ slug }),
        );
        queryClient.invalidateQueries(
          trpc.cookbooks.getSavedByUser.queryOptions({}),
        );
      },
    }),
  );
};
