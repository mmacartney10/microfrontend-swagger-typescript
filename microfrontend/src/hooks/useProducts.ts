import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/api";
import { ProductInput } from "@swagger-ts/api-client";

// Query keys
const QUERY_KEYS = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: () => productsService.productsList(),
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productsService.productsDetail({ id }),
    enabled: !!id,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductInput) =>
      productsService.productsCreate(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
};
