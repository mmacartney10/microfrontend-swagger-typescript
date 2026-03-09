import { queryOptions, mutationOptions } from "@tanstack/react-query";
import {
  Api,
  OrderInput,
  OrdersDetailParams,
  OrderStatusUpdate,
  OrdersPartialUpdateParams,
} from "../Api";

type OrdersService = Api<any>["ordersService"];

const QUERY_KEYS = {
  ordersList: ["ordersList"] as const,
  ordersDetail: (id: string) => ["ordersDetail", id] as const,
};

export const ordersListOptions = (service: OrdersService) =>
  queryOptions({
    queryKey: QUERY_KEYS.ordersList,
    queryFn: () => service.ordersList(),
  });

export const ordersCreateOptions = (service: OrdersService) =>
  mutationOptions({
    mutationFn: (data: OrderInput) => service.ordersCreate(data),
  });

export const ordersDetailOptions = (
  service: OrdersService,
  params: OrdersDetailParams,
) =>
  queryOptions({
    queryKey: QUERY_KEYS.ordersDetail(params.id),
    queryFn: () => service.ordersDetail(params),
  });
