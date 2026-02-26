import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/api";
import { UserInput } from "@swagger-ts/api-client";

// Query keys
const QUERY_KEYS = {
  users: ["users"] as const,
};

// 4. Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => usersService.usersList(),
  });
};

// 5. Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserInput) => usersService.usersCreate(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

// 6. Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserInput }) =>
      usersService.usersUpdate({ id }, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};
