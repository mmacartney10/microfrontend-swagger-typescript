import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

const AdvancedAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  const queryClient = useQueryClient();

  // Fetch all data
  const { data: orders } = useQuery({
    queryKey: ["analytics-orders"],
    queryFn: () => apiClient.ordersService.ordersList(),
  });

  const { data: products } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: () => apiClient.productsService.productsList(),
  });

  const { data: users } = useQuery({
    queryKey: ["analytics-users"],
    queryFn: () => apiClient.usersService.usersList(),
  });

  const { data: categories } = useQuery({
    queryKey: ["analytics-categories"],
    queryFn: () => apiClient.categoriesService.categoriesList(),
  });

  // Advanced calculations
  const analytics = {
    revenue: {
      total:
        orders?.data?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
      growth: 12.5, // Mock growth percentage
      trend: "up",
    },
    conversion: {
      rate: 3.2, // Mock conversion rate
      orders: orders?.data?.length || 0,
      visitors: 1250, // Mock visitor count
    },
    customers: {
      total: users?.data?.length || 0,
      active: users?.data?.filter((u) => u.active).length || 0,
      retention: 85.3, // Mock retention rate
    },
    products: {
      performance:
        products?.data
          ?.map((p) => ({
            ...p,
            sales: Math.floor(Math.random() * 100) + 10, // Mock sales data
            views: Math.floor(Math.random() * 1000) + 50, // Mock view data
          }))
          .sort((a, b) => (b.sales || 0) - (a.sales || 0)) || [],
    },
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    color: string;
    icon: string;
    trend?: "up" | "down" | "flat";
  }> = ({ title, value, change, color, icon, trend = "up" }) => (
    <div
      style={{
        backgroundColor: "white",
        border: `2px solid ${color}`,
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          width: "60px",
          height: "60px",
          backgroundColor: color,
          borderRadius: "50%",
          opacity: 0.1,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "15px",
        }}
      >
        <div style={{ fontSize: "2rem" }}>{icon}</div>
        <div
          style={{
            backgroundColor:
              trend === "up"
                ? "#10B981"
                : trend === "down"
                  ? "#EF4444"
                  : "#6B7280",
            color: "white",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}{" "}
          {Math.abs(change)}%
        </div>
      </div>

      <h3
        style={{
          margin: "0 0 8px 0",
          color: "#374151",
          fontSize: "0.9rem",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>
      <div style={{ fontSize: "2.5rem", fontWeight: "bold", color }}>
        {value}
      </div>
    </div>
  );

  const ChartBar: React.FC<{
    label: string;
    value: number;
    maxValue: number;
    color: string;
  }> = ({ label, value, maxValue, color }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span style={{ fontWeight: "500" }}>{label}</span>
          <span style={{ color: "#666" }}>{value}</span>
        </div>
        <div
          style={{
            height: "12px",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: color,
              borderRadius: "6px",
              transition: "width 0.8s ease-out",
            }}
          />
        </div>
      </div>
    );
  };

  const HeatmapCell: React.FC<{ intensity: number; day: string }> = ({
    intensity,
    day,
  }) => {
    const getColor = (intensity: number) => {
      if (intensity < 20) return "#ebedf0";
      if (intensity < 40) return "#c6e48b";
      if (intensity < 60) return "#7bc96f";
      if (intensity < 80) return "#239a3b";
      return "#196127";
    };

    return (
      <div
        style={{
          width: "15px",
          height: "15px",
          backgroundColor: getColor(intensity),
          borderRadius: "3px",
          margin: "1px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1f2937",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {day}: {intensity} orders
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📈 Advanced Analytics</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Deep insights into your business performance with advanced metrics
      </p>

      {/* Time Range Selector */}
      <div style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        {[
          { id: "day", label: "24H" },
          { id: "week", label: "7D" },
          { id: "month", label: "30D" },
          { id: "quarter", label: "3M" },
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setTimeframe(period.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid",
              borderColor: timeframe === period.id ? "#3B82F6" : "#e5e7eb",
              backgroundColor: timeframe === period.id ? "#3B82F6" : "white",
              color: timeframe === period.id ? "white" : "#374151",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.revenue.total.toLocaleString()}`}
          change={analytics.revenue.growth}
          color="#10B981"
          icon="💰"
          trend="up"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversion.rate}%`}
          change={0.8}
          color="#3B82F6"
          icon="🎯"
          trend="up"
        />
        <MetricCard
          title="Active Customers"
          value={analytics.customers.active}
          change={5.2}
          color="#8B5CF6"
          icon="👥"
          trend="up"
        />
        <MetricCard
          title="Customer Retention"
          value={`${analytics.customers.retention}%`}
          change={-1.2}
          color="#F59E0B"
          icon="🔄"
          trend="down"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Top Products Performance */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>🏆 Top Performing Products</h3>
          {analytics.products.performance.slice(0, 8).map((product, index) => {
            const maxSales = Math.max(
              ...analytics.products.performance.map((p) => p.sales || 0),
            );
            return (
              <ChartBar
                key={product.id}
                label={`${index + 1}. ${product.name}`}
                value={product.sales || 0}
                maxValue={maxSales}
                color={`hsl(${200 + index * 20}, 70%, 50%)`}
              />
            );
          })}
        </div>

        {/* Customer Insights */}
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>👤 Customer Insights</h3>

          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>
              User Roles
            </h4>
            {["admin", "moderator", "user"].map((role) => {
              const count =
                users?.data?.filter((u) => u.role === role).length || 0;
              const total = users?.data?.length || 1;
              const percentage = Math.round((count / total) * 100);
              const colors = {
                admin: "#EF4444",
                moderator: "#F59E0B",
                user: "#10B981",
              };

              return (
                <div key={role} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        textTransform: "capitalize",
                        fontSize: "0.9rem",
                      }}
                    >
                      {role}
                    </span>
                    <span style={{ color: "#666", fontSize: "0.9rem" }}>
                      {count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: colors[role as keyof typeof colors],
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>
              Activity Status
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
                >
                  {analytics.customers.active}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>Active</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#EF4444",
                  }}
                >
                  {analytics.customers.total - analytics.customers.active}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  Inactive
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          🔥 Order Activity Heatmap (Last 7 Days)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span
                style={{ width: "30px", fontSize: "0.8rem", color: "#666" }}
              >
                {day}
              </span>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 24 }, (_, hour) => {
                  const intensity = Math.floor(Math.random() * 100);
                  return (
                    <HeatmapCell
                      key={`${day}-${hour}`}
                      intensity={intensity}
                      day={`${day} ${hour}:00`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "15px",
            fontSize: "0.8rem",
            color: "#666",
          }}
        >
          <span style={{ marginRight: "10px" }}>Less</span>
          <div style={{ display: "flex", gap: "2px", marginRight: "10px" }}>
            {[10, 30, 50, 70, 90].map((intensity) => (
              <div
                key={intensity}
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor:
                    intensity < 20
                      ? "#ebedf0"
                      : intensity < 40
                        ? "#c6e48b"
                        : intensity < 60
                          ? "#7bc96f"
                          : intensity < 80
                            ? "#239a3b"
                            : "#196127",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Advanced KPIs */}
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>⚡ Advanced KPIs</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "8px",
                color: "#3B82F6",
              }}
            >
              📊
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#3B82F6",
              }}
            >
              $
              {Math.round(
                analytics.revenue.total / (orders?.data?.length || 1),
              )}
            </div>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>
              Avg Order Value
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "8px",
                color: "#10B981",
              }}
            >
              🎯
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#10B981",
              }}
            >
              {Math.round(
                (analytics.customers.active / analytics.customers.total) * 100,
              )}
              %
            </div>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>
              User Activation
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "8px",
                color: "#8B5CF6",
              }}
            >
              ⏱️
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#8B5CF6",
              }}
            >
              2.3m
            </div>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>
              Avg Session Time
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "8px",
                color: "#F59E0B",
              }}
            >
              🔄
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#F59E0B",
              }}
            >
              4.2
            </div>
            <div style={{ color: "#666", fontSize: "0.9rem" }}>
              Pages per Session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
