import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export const useGetCurrentUser = () => {
  const trpc = useTRPC();
  const { isSignedIn } = useAuth();

  return useQuery({
    ...trpc.users.getCurrentUser.queryOptions(),
    enabled: !!isSignedIn,
  });
};

export type UserSortBy = "newest" | "most_recipes" | "most_blogs" | "most_cookbooks" | "top_selling";

export const useGetUsers = (sortBy: UserSortBy = "newest", page = 1, pageSize = 16) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.users.getMany.queryOptions({ sortBy, page, pageSize }),
  );
};

export const useGetUserByUsername = (username: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.users.getByUsername.queryOptions({ username }),
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.updateProfile.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.getCurrentUser.queryOptions());
      },
    }),
  );
};
