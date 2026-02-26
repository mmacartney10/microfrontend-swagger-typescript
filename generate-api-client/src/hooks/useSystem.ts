import { useQuery } from "@tanstack/react-query";
import { Api } from "../Api";

type SystemService = Api<any>["system"];

const QUERY_KEYS = {
  health: ["system", "health"] as const,
};

export const useSystemHealth = (service: SystemService) => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => service.healthList(),
    refetchInterval: 30000, // Check health every 30 seconds
  });
};
