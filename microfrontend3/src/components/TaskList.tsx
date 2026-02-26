import React from "react";
import { useTasks, useCreateTask, useUpdateTask } from "../hooks/useTasks";
import { Task, TaskInput } from "@swagger-ts/api-client";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleCreateTask = () => {
    const newTask: TaskInput = {
      title: `Task ${Date.now()}`,
      description: "New task description",
      priority: "medium",
      completed: false,
    };
    createTask.mutate(newTask);
  };

  const handleToggleComplete = (task: Task) => {
    if (task.id && task.title) {
      updateTask.mutate({
        id: task.id,
        task: {
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          completed: !task.completed,
        },
      });
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {String(error)}</div>;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>📋 Tasks</h3>
      <button
        onClick={handleCreateTask}
        disabled={createTask.isPending}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        {createTask.isPending ? "Creating..." : "Add Task"}
      </button>

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {tasks?.data?.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              margin: "5px 0",
              backgroundColor: task.completed ? "#f0f8ff" : "white",
            }}
          >
            <strong>{task.title}</strong>
            <span
              style={{ marginLeft: "10px", fontSize: "12px", color: "#666" }}
            >
              ({task.priority})
            </span>
            <button
              onClick={() => handleToggleComplete(task)}
              style={{ marginLeft: "10px", padding: "2px 6px" }}
            >
              {task.completed ? "✓" : "○"}
            </button>
            <p style={{ margin: "4px 0", fontSize: "14px" }}>
              {task.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
