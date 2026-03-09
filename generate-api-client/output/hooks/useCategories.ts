import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, CategoryInput, CategoriesDeleteParams } from "../Api";

type CategoriesService = Api<any>["categoriesService"];

const QUERY_KEYS = {
      categoriesList: ["categoriesList", ] as const,
      };

export const useCategoriesList = (service: CategoriesService) => {
  return useQuery({
    queryKey: QUERY_KEYS.categoriesList,
    queryFn: () => service.categoriesList(),
  });
};






export const useCategoriesCreate = (service: CategoriesService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryInput) => service.categoriesCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};






export const useCategoriesDelete = (service: CategoriesService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CategoriesDeleteParams) => service.categoriesDelete(params),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
