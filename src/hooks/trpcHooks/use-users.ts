import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.users.getCurrentUser.queryOptions());
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
