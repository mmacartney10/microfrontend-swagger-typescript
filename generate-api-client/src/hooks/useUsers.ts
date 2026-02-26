import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, UserInput } from "../Api";

type UsersService = Api<any>["usersService"];

const QUERY_KEYS = {
  users: ["users"] as const,
};

export const useUsers = (service: UsersService) => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => service.usersList(),
  });
};

export const useCreateUser = (service: UsersService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserInput) => service.usersCreate(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

export const useUpdateUser = (service: UsersService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserInput }) =>
      service.usersUpdate({ id }, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};
