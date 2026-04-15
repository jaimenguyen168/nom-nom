import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.categories.getCategories.queryOptions());
};
