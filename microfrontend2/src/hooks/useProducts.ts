import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services/api";

// Query keys
const QUERY_KEYS = {
  products: ["products"] as const,
};

// 7. Get all products (read-only)
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: () => productsService.productsList(),
  });
};
