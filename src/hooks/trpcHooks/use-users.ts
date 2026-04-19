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
