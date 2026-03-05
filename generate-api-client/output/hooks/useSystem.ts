import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../Api";

type System = Api<any>["system"];

const QUERY_KEYS = {
      healthList: ["healthList", ] as const,
  };

export const useHealthList = (service: System) => {
  return useQuery({
    queryKey: QUERY_KEYS.healthList,
    queryFn: () => service.healthList(),
  });
};




