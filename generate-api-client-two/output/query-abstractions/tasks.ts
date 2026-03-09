
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { Api, TaskInput, TasksUpdateParams } from "../Api";

type TasksService = Api<any>["tasksService"];

const QUERY_KEYS = {
      tasksList: ["tasksList", ] as const,
      };

export const tasksListOptions = (service: TasksService) =>
  queryOptions({
    queryKey: QUERY_KEYS.tasksList,
    queryFn: () => service.tasksList(),
  });






export const tasksCreateOptions = (service: TasksService) =>
  mutationOptions({
    mutationFn: (data: TaskInput) => service.tasksCreate(data),
  });





export const tasksUpdateOptions = (service: TasksService) =>
  mutationOptions({
    mutationFn: ({ params, data }: { params: TasksUpdateParams, data: TaskInput }) => service.tasksUpdate(params, data),
  });

