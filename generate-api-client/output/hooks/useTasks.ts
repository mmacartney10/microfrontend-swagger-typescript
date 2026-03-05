import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, TaskInput, TasksUpdateParams } from "../Api";

type TasksService = Api<any>["tasksService"];

const QUERY_KEYS = {
      tasksList: ["tasksList", ] as const,
      };

export const useTasksList = (service: TasksService) => {
  return useQuery({
    queryKey: QUERY_KEYS.tasksList,
    queryFn: () => service.tasksList(),
  });
};






export const useTasksCreate = (service: TasksService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskInput) => service.tasksCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};





export const useTasksUpdate = (service: TasksService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ params, data }: { params: TasksUpdateParams, data: TaskInput }) => service.tasksUpdate(params, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

