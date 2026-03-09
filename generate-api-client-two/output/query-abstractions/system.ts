
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api } from "../Api";

type System = Api<any>["system"];

export const QUERY_KEYS_SYSTEM = {
      healthList: ["healthList", ] as const,
  };

export const healthListOptions = (service: System) =>
  queryOptions({
    queryKey: QUERY_KEYS_SYSTEM.healthList,
    queryFn: () => service.healthList(),
  });




