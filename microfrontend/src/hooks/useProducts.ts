import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsListOptions,
  productsDetailOptions,
  productsCreateOptions,
  ProductInput,
  ProductsDetailParams,
  QUERY_KEYS_PRODUCTS,
} from "../@swagger-ts";
import { productsService } from "../services/api";

export const useProductsList = () => {
  return useQuery(productsListOptions(productsService));
};

export const useProductsDetail = (params: ProductsDetailParams) => {
  return useQuery({
    ...productsDetailOptions(productsService, params),
    enabled: !!params.id,
  });
};

export const useProductsCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...productsCreateOptions(productsService),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS_PRODUCTS.productsList,
      });
    },
  });
};
