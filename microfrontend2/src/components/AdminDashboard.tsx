import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch all data for admin overview
  const { data: tasks } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: () => apiClient.tasksService.tasksList(),
  });

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiClient.usersService.usersList(),
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => apiClient.ordersService.ordersList(),
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => apiClient.categoriesService.categoriesList(),
  });

  // Admin actions
  const toggleUserMutation = useMutation({
    mutationFn: (userId: string) => {
      const user = users?.data?.find((u) => u.id === userId);
      return apiClient.usersService.usersUpdate({
        id: userId,
        user: { ...user, active: !user?.active },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) =>
      apiClient.tasksService.tasksDelete({ id: taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
  });

  // Statistics
  const totalUsers = users?.data?.length || 0;
  const activeUsers = users?.data?.filter((u) => u.active)?.length || 0;
  const totalTasks = tasks?.data?.length || 0;
  const completedTasks = tasks?.data?.filter((t) => t.completed)?.length || 0;
  const totalOrders = orders?.data?.length || 0;
  const totalRevenue =
    orders?.data?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    color: string;
    icon: string;
  }> = ({ title, value, color, icon }) => (
    <div
      style={{
        backgroundColor: "white",
        border: `3px solid ${color}`,
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{icon}</div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", color: "#666" }}>
        {title}
      </h3>
      <div style={{ fontSize: "2rem", fontWeight: "bold", color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍💼 Admin Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        System administration and user management
      </p>

      {/* Admin Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          title="Total Users"
          value={totalUsers}
          color="#8B5CF6"
          icon="👥"
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          color="#10B981"
          icon="✅"
        />
        <StatCard
          title="Task Completion"
          value={`${Math.round((completedTasks / totalTasks) * 100)}%`}
          color="#3B82F6"
          icon="📋"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          color="#F59E0B"
          icon="💰"
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        {/* User Management */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>👥 User Management</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {users?.data?.slice(0, 10).map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: user.active ? "#f0fdf4" : "#fef2f2",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{user.name}</div>
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {user.email}
                  </div>
                  <span
                    style={{
                      backgroundColor:
                        user.role === "admin"
                          ? "#dc2626"
                          : user.role === "moderator"
                            ? "#f59e0b"
                            : "#10b981",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.8em",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => toggleUserMutation.mutate(user.id!)}
                  disabled={toggleUserMutation.isPending}
                  style={{
                    backgroundColor: user.active ? "#EF4444" : "#10B981",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "0.9em",
                    cursor: "pointer",
                  }}
                >
                  {user.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>📋 Task Administration</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {tasks?.data?.slice(0, 10).map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: task.completed ? "#f0fdf4" : "#fffbeb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#666" : "#000",
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {task.description?.substring(0, 50)}...
                  </div>
                </div>
                <button
                  onClick={() => deleteTaskMutation.mutate(task.id!)}
                  disabled={deleteTaskMutation.isPending}
                  style={{
                    backgroundColor: "#EF4444",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "0.9em",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#1f2937",
          borderRadius: "12px",
          padding: "24px",
          color: "white",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>🖥️ System Information</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <strong>Database Status:</strong>
            <br />
            <small style={{ color: "#10B981" }}>✅ Connected</small>
          </div>
          <div>
            <strong>API Uptime:</strong>
            <br />
            <small>99.9% (7 days)</small>
          </div>
          <div>
            <strong>Active Sessions:</strong>
            <br />
            <small>{activeUsers} users online</small>
          </div>
          <div>
            <strong>Server Load:</strong>
            <br />
            <small style={{ color: "#F59E0B" }}>⚠️ Moderate (65%)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
