import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  usersListOptions,
  usersCreateOptions,
  usersUpdateOptions,
  UserInput,
  QUERY_KEYS_USERS,
} from "../@swagger-ts";
import { usersService } from "../services/api";

export const useUsersList = () => {
  return useQuery(usersListOptions(usersService));
};

export const useUsersCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...usersCreateOptions(usersService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_USERS.usersList });
    },
  });
};

export const useUsersUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...usersUpdateOptions(usersService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_USERS.usersList });
    },
  });
};
