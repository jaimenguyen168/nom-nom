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

export const useIsFollowing = (targetUserId: string | undefined) => {
  const trpc = useTRPC();
  const { isSignedIn } = useAuth();

  return useQuery({
    ...trpc.users.isFollowing.queryOptions({ targetUserId: targetUserId ?? "" }),
    enabled: !!isSignedIn && !!targetUserId,
  });
};

export const useToggleFollow = (targetUserId: string, targetUsername: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const follow = useMutation(
    trpc.users.follow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.isFollowing.queryOptions({ targetUserId }));
        queryClient.invalidateQueries(trpc.users.getByUsername.queryOptions({ username: targetUsername }));
      },
    }),
  );

  const unfollow = useMutation(
    trpc.users.unfollow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.isFollowing.queryOptions({ targetUserId }));
        queryClient.invalidateQueries(trpc.users.getByUsername.queryOptions({ username: targetUsername }));
      },
    }),
  );

  const handleToggle = () => {
    const isFollowing = queryClient.getQueryData(
      trpc.users.isFollowing.queryOptions({ targetUserId }).queryKey,
    ) as { isFollowing: boolean } | undefined;

    if (isFollowing?.isFollowing) {
      unfollow.mutate({ targetUserId });
    } else {
      follow.mutate({ targetUserId });
    }
  };

  return {
    handleToggle,
    isPending: follow.isPending || unfollow.isPending,
  };
};
