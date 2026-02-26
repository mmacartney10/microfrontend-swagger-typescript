import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, TaskInput } from "../Api";

type TasksService = Api<any>["tasksService"];

const QUERY_KEYS = {
  tasks: ["tasks"] as const,
};

export const useTasks = (service: TasksService) => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: () => service.tasksList(),
  });
};

export const useCreateTask = (service: TasksService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskInput) => service.tasksCreate(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};

export const useUpdateTask = (service: TasksService) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskInput }) =>
      service.tasksUpdate({ id }, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};
