import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, CategoryInput } from "../Api";

type CategoriesService = Api<any>["categoriesService"];

const QUERY_KEYS = {
  categories: ["categories"] as const,
};

export const useCategories = (service: CategoriesService) => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => service.categoriesList(),
  });
};

export const useCreateCategory = (service: CategoriesService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CategoryInput) => service.categoriesCreate(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

export const useDeleteCategory = (service: CategoriesService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.categoriesDelete({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};
