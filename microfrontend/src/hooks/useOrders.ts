import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ordersListOptions,
  ordersCreateOptions,
  ordersDetailOptions,
  OrderInput,
  OrdersDetailParams,
  QUERY_KEYS_ORDERS,
} from "../@swagger-ts";
import { ordersService } from "../services/api";

export const useOrdersList = () => {
  return useQuery(ordersListOptions(ordersService));
};

export const useOrdersDetail = (params: OrdersDetailParams) => {
  return useQuery({
    ...ordersDetailOptions(ordersService, params),
    enabled: !!params.id,
  });
};

export const useOrdersCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...ordersCreateOptions(ordersService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_ORDERS.ordersList });
    },
  });
};
