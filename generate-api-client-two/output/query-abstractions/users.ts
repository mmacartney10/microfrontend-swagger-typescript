
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, UserInput, UsersUpdateParams } from "../Api";

type UsersService = Api<any>["usersService"];

const QUERY_KEYS = {
      usersList: ["usersList", ] as const,
      };

export const usersListOptions = (service: UsersService) =>
  queryOptions({
    queryKey: QUERY_KEYS.usersList,
    queryFn: () => service.usersList(),
  });






export const usersCreateOptions = (service: UsersService) =>
  mutationOptions({
    mutationFn: (data: UserInput) => service.usersCreate(data),
  });





export const usersUpdateOptions = (service: UsersService) =>
  mutationOptions({
    mutationFn: ({ params, data }: { params: UsersUpdateParams, data: UserInput }) => service.usersUpdate(params, data),
  });

