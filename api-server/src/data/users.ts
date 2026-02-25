export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "moderator";
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    language: string;
  };
}

export const usersData: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    active: true,
    lastLogin: "2026-02-20T08:30:00Z",
    createdAt: "2025-12-15T10:00:00Z",
    preferences: {
      theme: "dark",
      notifications: true,
      language: "en",
    },
  },
  {
    id: "2",
    username: "janesmith",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    active: true,
    lastLogin: "2026-02-19T16:45:00Z",
    createdAt: "2026-01-10T14:20:00Z",
    preferences: {
      theme: "light",
      notifications: false,
      language: "en",
    },
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike.brown@example.com",
    firstName: "Mike",
    lastName: "Brown",
    role: "moderator",
    active: false,
    createdAt: "2025-11-20T09:00:00Z",
    preferences: {
      theme: "light",
      notifications: true,
      language: "es",
    },
  },
];
