import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, ProductInput, ProductsDetailParams } from "../Api";

type ProductsService = Api<any>["productsService"];

const QUERY_KEYS = {
      productsList: ["productsList", ] as const,
          productsDetail: (id: string) => ["productsDetail", id] as const,
  };

export const useProductsList = (service: ProductsService) => {
  return useQuery({
    queryKey: QUERY_KEYS.productsList,
    queryFn: () => service.productsList(),
  });
};






export const useProductsCreate = (service: ProductsService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInput) => service.productsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};



export const useProductsDetail = (service: ProductsService, params: ProductsDetailParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.productsDetail(params.id),
    queryFn: () => service.productsDetail(params),
    enabled: !!params.id,
  });
};



