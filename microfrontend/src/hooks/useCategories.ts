import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoriesListOptions,
  categoriesCreateOptions,
  categoriesDeleteOptions,
  QUERY_KEYS_CATEGORIES,
} from "@swagger-ts/api-client-two";
import { categoriesService } from "../services/api";

export const useCategoriesList = () => {
  return useQuery(categoriesListOptions(categoriesService));
};

export const useCategoriesCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...categoriesCreateOptions(categoriesService),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS_CATEGORIES.categoriesList,
      });
    },
  });
};

export const useCategoriesDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...categoriesDeleteOptions(categoriesService),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS_CATEGORIES.categoriesList,
      });
    },
  });
};
