import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useCreateBlog = () => {
  const trpc = useTRPC();
  return useMutation(trpc.blogs.create.mutationOptions());
};

export const useGetBlog = (username: string, slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.blogs.getByUsernameAndSlug.queryOptions({ username, slug }),
    retry: false,
  });
};

export const useGetBlogs = (
  sortBy: "new" | "popular" | "a_z" = "new",
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
