
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api } from "../Api";

type System = Api<any>["system"];

const QUERY_KEYS = {
      healthList: ["healthList", ] as const,
  };

export const healthListOptions = (service: System) =>
  queryOptions({
    queryKey: QUERY_KEYS.healthList,
    queryFn: () => service.healthList(),
  });




