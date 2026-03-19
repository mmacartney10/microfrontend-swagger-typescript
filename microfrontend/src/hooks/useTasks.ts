import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tasksListOptions,
  tasksCreateOptions,
  tasksUpdateOptions,
  TaskInput,
  QUERY_KEYS_TASKS,
} from "../@swagger-ts";
import { tasksService } from "../services/api";

export const useTasksList = () => {
  return useQuery(tasksListOptions(tasksService));
};

export const useTasksCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...tasksCreateOptions(tasksService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_TASKS.tasksList });
    },
  });
};

export const useTasksUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...tasksUpdateOptions(tasksService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_TASKS.tasksList });
    },
  });
};
