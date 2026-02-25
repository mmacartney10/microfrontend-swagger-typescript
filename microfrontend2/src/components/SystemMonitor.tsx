import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  status: "success" | "warning" | "error";
}

const SystemMonitor: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const queryClient = useQueryClient();

  // Generate mock audit logs
  const generateAuditLogs = (): AuditLog[] => {
    const actions = [
      "CREATE",
      "UPDATE",
      "DELETE",
      "LOGIN",
      "LOGOUT",
      "EXPORT",
      "IMPORT",
    ];
    const resources = ["User", "Product", "Order", "Category", "Task"];
    const users = [
      "admin@example.com",
      "john.doe@example.com",
      "jane.smith@example.com",
    ];
    const statuses: ("success" | "warning" | "error")[] = [
      "success",
      "success",
      "success",
      "warning",
      "error",
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
      user: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      resource: resources[Math.floor(Math.random() * resources.length)],
      details: `Performed ${actions[Math.floor(Math.random() * actions.length)].toLowerCase()} operation`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const auditLogs = generateAuditLogs();

  // System health queries
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["monitor-orders"],
    queryFn: () => apiClient.ordersService.ordersList(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["monitor-users"],
    queryFn: () => apiClient.usersService.usersList(),
    refetchInterval: 30000,
  });

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["monitor-products"],
    queryFn: () => apiClient.productsService.productsList(),
    refetchInterval: 30000,
  });

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["monitor-tasks"],
    queryFn: () => apiClient.tasksService.tasksList(),
    refetchInterval: 30000,
  });

  // System metrics
  const systemMetrics = {
    apiLatency: Math.random() * 100 + 50, // Mock latency 50-150ms
    errorRate: Math.random() * 5, // Mock error rate 0-5%
    throughput: Math.random() * 1000 + 500, // Mock throughput 500-1500 req/min
    uptime: 99.95, // Mock uptime
    memoryUsage: Math.random() * 30 + 60, // Mock memory usage 60-90%
    cpuUsage: Math.random() * 40 + 30, // Mock CPU usage 30-70%
  };

  const services = [
    {
      name: "Orders Service",
      status: ordersError ? "error" : ordersLoading ? "checking" : "healthy",
      responseTime: Math.random() * 100 + 20,
      lastCheck: new Date(),
      endpoints: [
        "GET /orders",
        "POST /orders",
        "PUT /orders/:id",
        "DELETE /orders/:id",
      ],
    },
    {
      name: "Users Service",
      status: usersError ? "error" : usersLoading ? "checking" : "healthy",
      responseTime: Math.random() * 100 + 20,
      lastCheck: new Date(),
      endpoints: [
        "GET /users",
        "POST /users",
        "PUT /users/:id",
        "DELETE /users/:id",
      ],
    },
    {
      name: "Products Service",
      status: productsError
        ? "error"
        : productsLoading
          ? "checking"
          : "healthy",
      responseTime: Math.random() * 100 + 20,
      lastCheck: new Date(),
      endpoints: [
        "GET /products",
        "POST /products",
        "PUT /products/:id",
        "DELETE /products/:id",
      ],
    },
    {
      name: "Tasks Service",
      status: tasksError ? "error" : tasksLoading ? "checking" : "healthy",
      responseTime: Math.random() * 100 + 20,
      lastCheck: new Date(),
      endpoints: [
        "GET /tasks",
        "POST /tasks",
        "PUT /tasks/:id",
        "DELETE /tasks/:id",
      ],
    },
  ];

  const MetricGauge: React.FC<{
    title: string;
    value: number;
    max: number;
    unit: string;
    color: string;
  }> = ({ title, value, max, unit, color }) => {
    const percentage = (value / max) * 100;
    const strokeDasharray = `${percentage * 2.51}, 251`;

    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            position: "relative",
            width: "120px",
            height: "120px",
            margin: "0 auto",
          }}
        >
          <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="60"
              cy="60"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="40"
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color }}>
              {value.toFixed(1)}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>{unit}</div>
          </div>
        </div>
        <h4 style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
          {title}
        </h4>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🖥️ System Monitor</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Real-time system health monitoring and audit logging
      </p>

      {/* System Status Overview */}
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>📊 System Performance Metrics</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
          }}
        >
          <MetricGauge
            title="API Latency"
            value={systemMetrics.apiLatency}
            max={200}
            unit="ms"
            color={
              systemMetrics.apiLatency < 100
                ? "#10B981"
                : systemMetrics.apiLatency < 150
                  ? "#F59E0B"
                  : "#EF4444"
            }
          />
          <MetricGauge
            title="Error Rate"
            value={systemMetrics.errorRate}
            max={10}
            unit="%"
            color={
              systemMetrics.errorRate < 2
                ? "#10B981"
                : systemMetrics.errorRate < 5
                  ? "#F59E0B"
                  : "#EF4444"
            }
          />
          <MetricGauge
            title="Throughput"
            value={systemMetrics.throughput}
            max={2000}
            unit="req/min"
            color="#3B82F6"
          />
          <MetricGauge
            title="Memory Usage"
            value={systemMetrics.memoryUsage}
            max={100}
            unit="%"
            color={
              systemMetrics.memoryUsage < 75
                ? "#10B981"
                : systemMetrics.memoryUsage < 85
                  ? "#F59E0B"
                  : "#EF4444"
            }
          />
          <MetricGauge
            title="CPU Usage"
            value={systemMetrics.cpuUsage}
            max={100}
            unit="%"
            color={
              systemMetrics.cpuUsage < 50
                ? "#10B981"
                : systemMetrics.cpuUsage < 70
                  ? "#F59E0B"
                  : "#EF4444"
            }
          />
          <MetricGauge
            title="System Uptime"
            value={systemMetrics.uptime}
            max={100}
            unit="%"
            color="#10B981"
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Service Health */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>🔍 Service Health Status</h3>
          {services.map((service) => (
            <div
              key={service.name}
              style={{
                padding: "15px",
                marginBottom: "15px",
                border: `2px solid ${service.status === "healthy" ? "#10B981" : service.status === "error" ? "#EF4444" : "#F59E0B"}`,
                borderRadius: "8px",
                backgroundColor:
                  service.status === "healthy"
                    ? "#f0fdf4"
                    : service.status === "error"
                      ? "#fef2f2"
                      : "#fffbeb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h4 style={{ margin: 0, color: "#374151" }}>{service.name}</h4>
                <span
                  style={{
                    backgroundColor:
                      service.status === "healthy"
                        ? "#10B981"
                        : service.status === "error"
                          ? "#EF4444"
                          : "#F59E0B",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  {service.status === "healthy"
                    ? "✅ HEALTHY"
                    : service.status === "error"
                      ? "❌ ERROR"
                      : "⚠️ WARNING"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  Response Time:
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {service.responseTime.toFixed(0)}ms
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  Last Check:
                </span>
                <span style={{ fontSize: "0.9rem" }}>
                  {service.lastCheck.toLocaleTimeString()}
                </span>
              </div>

              <details style={{ marginTop: "10px" }}>
                <summary style={{ cursor: "pointer", color: "#3B82F6" }}>
                  View Endpoints
                </summary>
                <div style={{ marginTop: "8px" }}>
                  {service.endpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "4px 8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {endpoint}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>⚡ Quick Actions</h3>

          <div style={{ display: "grid", gap: "10px" }}>
            <button
              style={{
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              🔄 Refresh All Services
            </button>

            <button
              style={{
                backgroundColor: "#3B82F6",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              🗑️ Clear Cache
            </button>

            <button
              style={{
                backgroundColor: "#F59E0B",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              📊 Generate Report
            </button>

            <button
              style={{
                backgroundColor: "#8B5CF6",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              🔔 Set Alert
            </button>
          </div>

          <div style={{ marginTop: "30px" }}>
            <h4 style={{ marginBottom: "15px", color: "#374151" }}>
              Alert Thresholds
            </h4>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                Response Time Alert (ms)
              </label>
              <input
                type="range"
                min="50"
                max="500"
                defaultValue="200"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                Error Rate Alert (%)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                Memory Usage Alert (%)
              </label>
              <input
                type="range"
                min="50"
                max="95"
                defaultValue="85"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0 }}>📋 Audit Logs</h3>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {auditLogs.slice(0, 20).map((log) => (
            <div
              key={log.id}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 80px 120px 100px 1fr 80px",
                gap: "15px",
                alignItems: "center",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "#666" }}>
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span
                style={{
                  backgroundColor:
                    log.status === "success"
                      ? "#10B981"
                      : log.status === "warning"
                        ? "#F59E0B"
                        : "#EF4444",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {log.status.toUpperCase()}
              </span>
              <span style={{ fontWeight: "500" }}>{log.user}</span>
              <span
                style={{
                  backgroundColor: "#3B82F6",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                {log.action}
              </span>
              <span>
                {log.resource}: {log.details}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                {log.id}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button
            style={{
              backgroundColor: "#6B7280",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Load More Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
