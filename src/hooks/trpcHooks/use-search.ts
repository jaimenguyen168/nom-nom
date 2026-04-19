import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useSearchRecipes = (query: string) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.recipes.search.queryOptions({ query }),
    enabled: query.length > 1,
  });
};

export const useSearchBlogs = (query: string) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.blogs.search.queryOptions({ query }),
    enabled: query.length > 1,
  });
};

export const useSearchCategories = (query: string) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.categories.search.queryOptions({ query }),
    enabled: query.length > 1,
  });
};

export const useSearchUsers = (query: string) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.users.search.queryOptions({ query }),
    enabled: query.length > 1,
  });
};
