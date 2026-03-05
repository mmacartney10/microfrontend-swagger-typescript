import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, OrderInput, OrdersDetailParams, OrderStatusUpdate, OrdersPartialUpdateParams } from "../Api";

type OrdersService = Api<any>["ordersService"];

const QUERY_KEYS = {
      ordersList: ["ordersList", ] as const,
          ordersDetail: (id: string) => ["ordersDetail", id] as const,
    };

export const useOrdersList = (service: OrdersService) => {
  return useQuery({
    queryKey: QUERY_KEYS.ordersList,
    queryFn: () => service.ordersList(),
  });
};






export const useOrdersCreate = (service: OrdersService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderInput) => service.ordersCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};



export const useOrdersDetail = (service: OrdersService, params: OrdersDetailParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.ordersDetail(params.id),
    queryFn: () => service.ordersDetail(params),
    enabled: !!params.id,
  });
};







