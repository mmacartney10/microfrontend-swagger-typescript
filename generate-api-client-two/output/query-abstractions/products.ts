
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, ProductInput, ProductsDetailParams, ProductsUpdateParams } from "../Api";

type ProductsService = Api<any>["productsService"];

export const QUERY_KEYS_PRODUCTS = {
      productsList: ["productsList", ] as const,
          productsDetail: (id: string) => ["productsDetail", id] as const,
    };

export const productsListOptions = (service: ProductsService) =>
  queryOptions({
    queryKey: QUERY_KEYS_PRODUCTS.productsList,
    queryFn: () => service.productsList(),
  });






export const productsCreateOptions = (service: ProductsService) =>
  mutationOptions({
    mutationFn: (data: ProductInput) => service.productsCreate(data),
  });



export const productsDetailOptions = (service: ProductsService, params: ProductsDetailParams) =>
  queryOptions({
    queryKey: QUERY_KEYS_PRODUCTS.productsDetail(params.id),
    queryFn: () => service.productsDetail(params),
  });






export const productsUpdateOptions = (service: ProductsService) =>
  mutationOptions({
    mutationFn: ({ params, data }: { params: ProductsUpdateParams, data: ProductInput }) => service.productsUpdate(params, data),
  });

