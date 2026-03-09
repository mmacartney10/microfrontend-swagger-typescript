
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, OrderInput, OrdersDetailParams, OrderStatusUpdate, OrdersPartialUpdateParams } from "../Api";

type OrdersService = Api<any>["ordersService"];

export const QUERY_KEYS_ORDERS = {
      ordersList: ["ordersList", ] as const,
          ordersDetail: (id: string) => ["ordersDetail", id] as const,
    };

export const ordersListOptions = (service: OrdersService) =>
  queryOptions({
    queryKey: QUERY_KEYS_ORDERS.ordersList,
    queryFn: () => service.ordersList(),
  });






export const ordersCreateOptions = (service: OrdersService) =>
  mutationOptions({
    mutationFn: (data: OrderInput) => service.ordersCreate(data),
  });



export const ordersDetailOptions = (service: OrdersService, params: OrdersDetailParams) =>
  queryOptions({
    queryKey: QUERY_KEYS_ORDERS.ordersDetail(params.id),
    queryFn: () => service.ordersDetail(params),
  });






export const ordersPartialUpdateOptions = (service: OrdersService) =>
  mutationOptions({
    mutationFn: ({ params, data }: { params: OrdersPartialUpdateParams, data: OrderStatusUpdate }) => service.ordersPartialUpdate(params, data),
  });

