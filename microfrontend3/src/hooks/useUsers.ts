import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/api";

const QUERY_KEYS = {
  users: ["users"] as const,
};

export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => usersService.usersList(),
  });
};
