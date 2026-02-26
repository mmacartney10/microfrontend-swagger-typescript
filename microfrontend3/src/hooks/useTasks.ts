import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../services/api";
import { TaskInput } from "@swagger-ts/api-client";

const QUERY_KEYS = {
  tasks: ["tasks"] as const,
};

export const useTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: () => tasksService.tasksList(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskInput) => tasksService.tasksCreate(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskInput }) =>
      tasksService.tasksUpdate({ id }, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
};
