import React, { useState } from "react";
import {
  User,
  UserInput,
  useUsersList,
  useCreateUsers,
  useUpdateUsers,
} from "@swagger-ts/api-client";
import { usersService } from "../services/api";

const UserManager: React.FC = () => {
  const { data: users, isLoading, error } = useUsersList(usersService);
  const createUser = useCreateUsers(usersService);
  const updateUser = useUpdateUsers(usersService);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleCreateUser = () => {
    const newUser: UserInput = {
      username: `user_${Date.now()}`,
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      firstName: "Demo",
      lastName: "User",
      role: Math.random() > 0.5 ? "user" : "moderator",
    };
    createUser.mutate(newUser);
  };

  const handleToggleActive = (user: User) => {
    if (user.id) {
      const updatedUser: UserInput = {
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role || "user",
        active: !user.active,
      };
      updateUser.mutate({ id: user.id, user: updatedUser });
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {String(error)}</div>;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>👥 User Manager</h3>
      <button
        onClick={handleCreateUser}
        disabled={createUser.isPending}
        style={{
          marginBottom: "10px",
          padding: "5px 10px",
          backgroundColor: "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {createUser.isPending ? "Creating..." : "Add New User"}
      </button>

      <div style={{ overflowY: "auto" }}>
        {users?.data?.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              margin: "5px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: user.active ? "white" : "#f0f0f0",
            }}
          >
            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <div style={{ fontSize: "12px", color: "#666" }}>
                @{user.username} • {user.email}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  backgroundColor:
                    user.role === "admin"
                      ? "#ff6b6b"
                      : user.role === "moderator"
                        ? "#4ecdc4"
                        : "#95e1d3",
                  color: "white",
                }}
              >
                {user.role}
              </span>
              <button
                onClick={() => handleToggleActive(user)}
                style={{
                  padding: "2px 8px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: user.active ? "#ff6b6b" : "#4caf50",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {user.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManager;
