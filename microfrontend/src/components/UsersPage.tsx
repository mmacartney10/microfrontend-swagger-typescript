import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";
import { User, UserInput } from "@swagger-ts/api-client";

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.usersService.usersList(),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (newUser: UserInput) =>
      apiClient.usersService.usersCreate(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserInput }) =>
      apiClient.usersService.usersUpdate({ id }, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleCreateUser = () => {
    const newUser: UserInput = {
      username: `microfrontend_user_${Date.now()}`,
      email: `user${Date.now()}@microfrontend.com`,
      firstName: "Micro",
      lastName: "Frontend",
      role: "user",
      active: true,
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
    };
    createUserMutation.mutate(newUser);
  };

  const handleToggleActive = (user: User) => {
    if (user.id) {
      const updatedUser: UserInput = {
        username: user.username!,
        email: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        role: user.role!,
        active: !user.active,
        preferences: user.preferences,
      };
      updateUserMutation.mutate({ id: user.id, user: updatedUser });
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "#EF4444";
      case "moderator":
        return "#F59E0B";
      case "user":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Users Management</h2>

      <button
        onClick={handleCreateUser}
        disabled={createUserMutation.isPending}
        style={{
          backgroundColor: "#EC4899",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        {createUserMutation.isPending ? "Creating..." : "Add New User"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "15px",
        }}
      >
        {users?.data?.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: user.active ? "white" : "#f9fafb",
              opacity: user.active ? 1 : 0.7,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>
                  {user.firstName} {user.lastName}
                </h3>
                <p style={{ margin: "0", color: "#666", fontSize: "0.9em" }}>
                  @{user.username}
                </p>
              </div>
              <span
                style={{
                  backgroundColor: getRoleColor(user.role),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.8em",
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>Email:</strong> {user.email}
              </p>
              {user.lastLogin && (
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.9em",
                    color: "#666",
                  }}
                >
                  Last Login: {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              )}
            </div>

            {user.preferences && (
              <div style={{ marginBottom: "15px", fontSize: "0.9em" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "1em" }}>
                  Preferences
                </h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      backgroundColor:
                        user.preferences.theme === "dark"
                          ? "#374151"
                          : "#F3F4F6",
                      color:
                        user.preferences.theme === "dark" ? "white" : "#374151",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.8em",
                    }}
                  >
                    🎨 {user.preferences.theme}
                  </span>
                  <span
                    style={{
                      backgroundColor: user.preferences.notifications
                        ? "#10B981"
                        : "#EF4444",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.8em",
                    }}
                  >
                    {user.preferences.notifications
                      ? "🔔 Notifications On"
                      : "🔕 Notifications Off"}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.8em",
                    }}
                  >
                    🌍 {user.preferences.language?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  backgroundColor: user.active ? "#10B981" : "#EF4444",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                }}
              >
                {user.active ? "Active" : "Inactive"}
              </span>

              <button
                onClick={() => handleToggleActive(user)}
                disabled={updateUserMutation.isPending}
                style={{
                  backgroundColor: user.active ? "#EF4444" : "#10B981",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                }}
              >
                {user.active ? "Deactivate" : "Activate"}
              </button>
            </div>

            {user.createdAt && (
              <div
                style={{ fontSize: "0.8em", color: "#666", marginTop: "10px" }}
              >
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
