
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, CategoryInput, CategoriesDeleteParams } from "../Api";

type CategoriesService = Api<any>["categoriesService"];

const QUERY_KEYS = {
      categoriesList: ["categoriesList", ] as const,
      };

export const categoriesListOptions = (service: CategoriesService) =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesList,
    queryFn: () => service.categoriesList(),
  });






export const categoriesCreateOptions = (service: CategoriesService) =>
  mutationOptions({
    mutationFn: (data: CategoryInput) => service.categoriesCreate(data),
  });






export const categoriesDeleteOptions = (service: CategoriesService) =>
  mutationOptions({
    mutationFn: (params: CategoriesDeleteParams) => service.categoriesDelete(params),
  });
