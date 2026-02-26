import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, OrderInput } from "../Api";

type OrdersService = Api<any>["ordersService"];

const QUERY_KEYS = {
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
};

export const useOrders = (service: OrdersService) => {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => service.ordersList(),
  });
};

export const useOrder = (service: OrdersService, id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => service.ordersDetail({ id }),
    enabled: !!id,
  });
};

export const useCreateOrder = (service: OrdersService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: OrderInput) => service.ordersCreate(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};
