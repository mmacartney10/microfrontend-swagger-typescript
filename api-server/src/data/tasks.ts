export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
}

export const tasksData: Task[] = [
  {
    id: "1",
    title: "Setup development environment",
    description: "Install all necessary tools and dependencies",
    completed: true,
    priority: "high",
    assignedTo: "John Doe",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Design user interface",
    description: "Create wireframes and mockups for the application",
    completed: false,
    priority: "medium",
    dueDate: "2026-02-25T00:00:00Z",
    assignedTo: "Jane Smith",
    createdAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "3",
    title: "Write unit tests",
    description: "Implement comprehensive test coverage",
    completed: false,
    priority: "high",
    dueDate: "2026-02-28T00:00:00Z",
    createdAt: "2026-02-15T14:30:00Z",
  },
];
