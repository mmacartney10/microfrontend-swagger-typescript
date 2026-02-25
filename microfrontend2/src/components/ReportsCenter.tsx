import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api";

const ReportsCenter: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("7days");

  // Fetch data for reports
  const { data: orders } = useQuery({
    queryKey: ["reports-orders"],
    queryFn: () => apiClient.ordersService.ordersList(),
  });

  const { data: products } = useQuery({
    queryKey: ["reports-products"],
    queryFn: () => apiClient.productsService.productsList(),
  });

  const { data: users } = useQuery({
    queryKey: ["reports-users"],
    queryFn: () => apiClient.usersService.usersList(),
  });

  const { data: tasks } = useQuery({
    queryKey: ["reports-tasks"],
    queryFn: () => apiClient.tasksService.tasksList(),
  });

  // Calculate report data
  const salesData = {
    totalRevenue:
      orders?.data?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0,
    totalOrders: orders?.data?.length || 0,
    avgOrderValue: orders?.data?.length
      ? orders.data.reduce((sum, o) => sum + (o.totalAmount || 0), 0) /
        orders.data.length
      : 0,
    completedOrders:
      orders?.data?.filter((o) => o.status === "completed").length || 0,
  };

  const productData = {
    totalProducts: products?.data?.length || 0,
    activeProducts: products?.data?.filter((p) => p.active).length || 0,
    outOfStock: products?.data?.filter((p) => (p.stock || 0) === 0).length || 0,
    lowStock: products?.data?.filter((p) => (p.stock || 0) < 10).length || 0,
  };

  const userData = {
    totalUsers: users?.data?.length || 0,
    activeUsers: users?.data?.filter((u) => u.active).length || 0,
    newUsers:
      users?.data?.filter((u) => {
        const createdDate = new Date(u.createdAt || "");
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length || 0,
    adminUsers: users?.data?.filter((u) => u.role === "admin").length || 0,
  };

  const taskData = {
    totalTasks: tasks?.data?.length || 0,
    completedTasks: tasks?.data?.filter((t) => t.completed).length || 0,
    pendingTasks: tasks?.data?.filter((t) => !t.completed).length || 0,
    completionRate: tasks?.data?.length
      ? Math.round(
          (tasks.data.filter((t) => t.completed).length / tasks.data.length) *
            100,
        )
      : 0,
  };

  const ReportCard: React.FC<{
    title: string;
    value: string | number;
    color: string;
    icon: string;
  }> = ({ title, value, color, icon }) => (
    <div
      style={{
        backgroundColor: "white",
        border: `2px solid ${color}`,
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{icon}</div>
      <h4 style={{ margin: "0 0 8px 0", color: "#666" }}>{title}</h4>
      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color }}>
        {value}
      </div>
    </div>
  );

  const renderSalesReport = () => (
    <div>
      <h3 style={{ marginBottom: "20px" }}>💰 Sales Performance Report</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ReportCard
          title="Total Revenue"
          value={`$${salesData.totalRevenue.toLocaleString()}`}
          color="#10B981"
          icon="💵"
        />
        <ReportCard
          title="Total Orders"
          value={salesData.totalOrders}
          color="#3B82F6"
          icon="🛒"
        />
        <ReportCard
          title="Avg Order Value"
          value={`$${Math.round(salesData.avgOrderValue)}`}
          color="#8B5CF6"
          icon="📊"
        />
        <ReportCard
          title="Completed Orders"
          value={salesData.completedOrders}
          color="#F59E0B"
          icon="✅"
        />
      </div>

      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h4>Order Status Breakdown</h4>
        {["completed", "pending", "processing", "cancelled"].map((status) => {
          const count =
            orders?.data?.filter((o) => o.status === status).length || 0;
          const percentage =
            salesData.totalOrders > 0
              ? Math.round((count / salesData.totalOrders) * 100)
              : 0;
          const color =
            status === "completed"
              ? "#10B981"
              : status === "pending"
                ? "#F59E0B"
                : status === "processing"
                  ? "#3B82F6"
                  : "#EF4444";

          return (
            <div key={status} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{status}</span>
                <span>
                  {count} ({percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: color,
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProductReport = () => (
    <div>
      <h3 style={{ marginBottom: "20px" }}>📦 Product Inventory Report</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ReportCard
          title="Total Products"
          value={productData.totalProducts}
          color="#3B82F6"
          icon="📦"
        />
        <ReportCard
          title="Active Products"
          value={productData.activeProducts}
          color="#10B981"
          icon="✅"
        />
        <ReportCard
          title="Out of Stock"
          value={productData.outOfStock}
          color="#EF4444"
          icon="❌"
        />
        <ReportCard
          title="Low Stock"
          value={productData.lowStock}
          color="#F59E0B"
          icon="⚠️"
        />
      </div>

      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h4>Stock Status Details</h4>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {products?.data?.slice(0, 10).map((product) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor:
                  (product.stock || 0) === 0
                    ? "#fef2f2"
                    : (product.stock || 0) < 10
                      ? "#fffbeb"
                      : "#f0fdf4",
                borderRadius: "8px",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{product.name}</div>
                <div style={{ fontSize: "0.9em", color: "#666" }}>
                  ${product.price}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>
                  Stock: {product.stock || 0}
                </div>
                <div
                  style={{
                    color:
                      (product.stock || 0) === 0
                        ? "#EF4444"
                        : (product.stock || 0) < 10
                          ? "#F59E0B"
                          : "#10B981",
                    fontSize: "0.9em",
                  }}
                >
                  {(product.stock || 0) === 0
                    ? "Out of Stock"
                    : (product.stock || 0) < 10
                      ? "Low Stock"
                      : "In Stock"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserReport = () => (
    <div>
      <h3 style={{ marginBottom: "20px" }}>👥 User Analytics Report</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ReportCard
          title="Total Users"
          value={userData.totalUsers}
          color="#8B5CF6"
          icon="👥"
        />
        <ReportCard
          title="Active Users"
          value={userData.activeUsers}
          color="#10B981"
          icon="✅"
        />
        <ReportCard
          title="New Users (7d)"
          value={userData.newUsers}
          color="#3B82F6"
          icon="🆕"
        />
        <ReportCard
          title="Admin Users"
          value={userData.adminUsers}
          color="#EF4444"
          icon="👨‍💼"
        />
      </div>

      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h4>User Role Distribution</h4>
        {["admin", "moderator", "user"].map((role) => {
          const count = users?.data?.filter((u) => u.role === role).length || 0;
          const percentage =
            userData.totalUsers > 0
              ? Math.round((count / userData.totalUsers) * 100)
              : 0;
          const color =
            role === "admin"
              ? "#EF4444"
              : role === "moderator"
                ? "#F59E0B"
                : "#10B981";

          return (
            <div key={role} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{role}</span>
                <span>
                  {count} ({percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: color,
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTaskReport = () => (
    <div>
      <h3 style={{ marginBottom: "20px" }}>📋 Task Performance Report</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ReportCard
          title="Total Tasks"
          value={taskData.totalTasks}
          color="#3B82F6"
          icon="📋"
        />
        <ReportCard
          title="Completed Tasks"
          value={taskData.completedTasks}
          color="#10B981"
          icon="✅"
        />
        <ReportCard
          title="Pending Tasks"
          value={taskData.pendingTasks}
          color="#F59E0B"
          icon="⏳"
        />
        <ReportCard
          title="Completion Rate"
          value={`${taskData.completionRate}%`}
          color="#8B5CF6"
          icon="📈"
        />
      </div>

      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h4>Task Completion Progress</h4>
        <div
          style={{
            height: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: `${taskData.completionRate}%`,
              height: "100%",
              backgroundColor: "#10B981",
              borderRadius: "10px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <p style={{ color: "#666", margin: 0 }}>
          {taskData.completedTasks} out of {taskData.totalTasks} tasks completed
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Reports Center</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Comprehensive analytics and reporting dashboard
      </p>

      {/* Report Selection */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { id: "sales", label: "💰 Sales", icon: "💰" },
            { id: "products", label: "📦 Products", icon: "📦" },
            { id: "users", label: "👥 Users", icon: "👥" },
            { id: "tasks", label: "📋 Tasks", icon: "📋" },
          ].map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  selectedReport === report.id ? "#3B82F6" : "#e5e7eb",
                color: selectedReport === report.id ? "white" : "#374151",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              {report.label}
            </button>
          ))}
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            backgroundColor: "white",
          }}
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === "sales" && renderSalesReport()}
        {selectedReport === "products" && renderProductReport()}
        {selectedReport === "users" && renderUserReport()}
        {selectedReport === "tasks" && renderTaskReport()}
      </div>

      {/* Export Section */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>📤 Export Options</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📊 Export to Excel
          </button>
          <button
            style={{
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📄 Export to PDF
          </button>
          <button
            style={{
              backgroundColor: "#8B5CF6",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📧 Email Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsCenter;
