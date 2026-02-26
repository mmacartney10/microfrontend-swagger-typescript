import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/api";
import { CategoryInput } from "@swagger-ts/api-client";

const QUERY_KEYS = {
  categories: ["categories"] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => categoriesService.categoriesList(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CategoryInput) =>
      categoriesService.categoriesCreate(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};
