import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, UserInput, UsersUpdateParams } from "../Api";

type UsersService = Api<any>["usersService"];

const QUERY_KEYS = {
      usersList: ["usersList", ] as const,
      };

export const useUsersList = (service: UsersService) => {
  return useQuery({
    queryKey: QUERY_KEYS.usersList,
    queryFn: () => service.usersList(),
  });
};






export const useUsersCreate = (service: UsersService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserInput) => service.usersCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};





export const useUsersUpdate = (service: UsersService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ params, data }: { params: UsersUpdateParams, data: UserInput }) => service.usersUpdate(params, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

