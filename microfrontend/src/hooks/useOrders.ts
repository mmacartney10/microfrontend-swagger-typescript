import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/api";
import { OrderInput } from "@swagger-ts/api-client";

// Query keys
const QUERY_KEYS = {
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
};

// Get all orders
export const useOrders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => ordersService.ordersList(),
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: OrderInput) => ordersService.ordersCreate(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};

// Get single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => ordersService.ordersDetail({ id }),
    enabled: !!id,
  });
};
