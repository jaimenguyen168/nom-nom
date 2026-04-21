import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export type BlogSortType = "new" | "popular" | "a_z";
export type BlogStatusFilter = "all" | "published" | "draft" | "archived";

export const useCreateBlog = () => {
  const trpc = useTRPC();
  return useMutation(trpc.blogs.create.mutationOptions());
};

export const useGetBlogBySlug = (slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.blogs.getBySlug.queryOptions({ slug }),
    retry: false,
    staleTime: 60 * 1000 * 30, // 30 minute
  });
};

export const useGetBlog = (username: string, slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.blogs.getByUsernameAndSlug.queryOptions({ username, slug }),
    retry: false,
  });
};

export const useGetBlogs = (
  sortBy: BlogSortType = "new",
  pageSize = 12,
  page = 1,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.blogs.getMany.queryOptions({ sortBy, pageSize, page }),
  );
};

export const useIsSavedBlog = (blogId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogs.isSaved.queryOptions({ blogId }));
};

export const useBlogSavesCount = (blogId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogs.savesCount.queryOptions({ blogId }));
};

export const useToggleSaveBlog = (
  blogId: string,
  username: string,
  slug: string,
) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.blogs.toggleSave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogs.getByUsernameAndSlug.queryOptions({ username, slug }),
        );
        queryClient.invalidateQueries(
          trpc.blogs.isSaved.queryOptions({ blogId }),
        );
        queryClient.invalidateQueries(
          trpc.blogs.savesCount.queryOptions({ blogId }),
        );
        queryClient.invalidateQueries(
          trpc.blogs.getManyByUser.queryOptions({}),
        );
        queryClient.invalidateQueries(trpc.blogs.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.blogs.getSavedByUser.queryOptions({}),
        );
      },
    }),
  );

  const handleToggleSave = () => mutate({ blogId });

  return { handleToggleSave, isPending };
};

export const useGetRelatedRecipeId = (blogId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.blogs.getRelatedRecipeId.queryOptions({ blogId }));
};

export const useGetBlogsBySameCategories = (blogId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.blogs.getBySameCategories.queryOptions({ blogId }),
  );
};

export const useUpdateBlog = (username: string, slug: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogs.getByUsernameAndSlug.queryOptions({ username, slug }),
        );
      },
    }),
  );
};

export const useGetMyBlogs = (
  status: BlogStatusFilter = "all",
  pageSize = 12,
  page = 1,
) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.blogs.getManyByUser.queryOptions({ status, pageSize, page }),
    refetchInterval: 5000,
  });
};

export const useGetSavedBlogs = (pageSize = 12, page = 1) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.blogs.getSavedByUser.queryOptions({ pageSize, page }),
  );
};

export const useDeleteBlog = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.blogs.getManyByUser.queryOptions({}),
        );
        queryClient.invalidateQueries(trpc.blogs.getMany.queryOptions({}));
      },
    }),
  );
};
