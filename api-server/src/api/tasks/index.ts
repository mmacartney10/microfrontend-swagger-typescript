import { Request, Response } from "express";
import { tasksData, Task } from "../../data/tasks";

const getTasks = (request: Request, response: Response): void => {
  console.log("getTasks");
  response.status(200).json(tasksData);
};

const postTask = (request: Request, response: Response): void => {
  console.log("postTask", request.body);

  try {
    const newTask: Task = {
      id: String(tasksData.length + 1),
      ...request.body,
      createdAt: new Date().toISOString(),
    } as Task;

    tasksData.push(newTask);
    response.status(201).json(newTask);
  } catch (error) {
    response.status(400).json({ error: "Invalid task data" });
  }
};

const putTask = (request: Request, response: Response): void => {
  const { id } = request.params;
  console.log("putTask", id, request.body);

  try {
    const taskIndex = tasksData.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      response.status(404).json({ error: "Task not found" });
      return;
    }

    tasksData[taskIndex] = { ...tasksData[taskIndex], ...request.body };
    response.status(200).json(tasksData[taskIndex]);
  } catch (error) {
    response.status(400).json({ error: "Invalid task data" });
  }
};

export { getTasks, postTask, putTask };
