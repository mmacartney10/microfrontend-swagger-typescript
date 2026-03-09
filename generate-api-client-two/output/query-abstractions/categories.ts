import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, CategoryInput, CategoriesDeleteParams } from "../Api";

type CategoriesService = Api<any>["categoriesService"];

export const QUERY_KEYS_CATEGORIES = {
  categoriesList: ["categoriesList"] as const,
};

export const categoriesListOptions = (service: CategoriesService) =>
  queryOptions({
    queryKey: QUERY_KEYS_CATEGORIES.categoriesList,
    queryFn: () => service.categoriesList(),
  });

export const categoriesCreateOptions = (service: CategoriesService) =>
  mutationOptions({
    mutationFn: (data: CategoryInput) => service.categoriesCreate(data),
  });

export const categoriesDeleteOptions = (service: CategoriesService) =>
  mutationOptions({
    mutationFn: (params: CategoriesDeleteParams) =>
      service.categoriesDelete(params),
  });
