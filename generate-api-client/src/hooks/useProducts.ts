import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, ProductInput } from "../Api";

type ProductsService = Api<any>["productsService"];

const QUERY_KEYS = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
};

export const useProducts = (service: ProductsService) => {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: () => service.productsList(),
  });
};

export const useProduct = (service: ProductsService, id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => service.productsDetail({ id }),
    enabled: !!id,
  });
};

export const useCreateProduct = (service: ProductsService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductInput) => service.productsCreate(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
};
