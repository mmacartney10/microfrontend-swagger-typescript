import { useQuery } from "@tanstack/react-query";
import { system } from "../services/api";

// Query keys
const QUERY_KEYS = {
  health: ["health"] as const,
};

// System health check
export const useSystemHealth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => system.healthList(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
