import React, { useState } from "react";
import { Link } from "react-router-dom";
import webpackLogo from "../assets/webpack.png";

const Home: React.FC = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((count) => count + 1);
  const decrement = () => setCount((count) => count - 1);

  const features = [
    {
      title: "�‍💼 Admin Dashboard",
      description:
        "Comprehensive system administration with user management, task oversight, and real-time metrics",
      path: "/admin",
      color: "#EF4444",
      category: "Management",
    },
    {
      title: "📊 Reports Center",
      description:
        "Advanced reporting suite with sales analytics, product insights, and user analytics",
      path: "/reports",
      color: "#8B5CF6",
      category: "Analytics",
    },
    {
      title: "📈 Advanced Analytics",
      description:
        "Deep business intelligence with KPIs, performance metrics, and trend analysis",
      path: "/analytics",
      color: "#06B6D4",
      category: "Analytics",
    },
    {
      title: "🖥️ System Monitor",
      description:
        "Real-time system health monitoring, performance metrics, and audit logging",
      path: "/monitor",
      color: "#10B981",
      category: "Operations",
    },
    {
      title: "📋 Tasks Management",
      description:
        "Task management system with CRUD operations for productivity tracking",
      path: "/tasks",
      color: "#3B82F6",
      category: "Basic",
    },
    {
      title: "📦 Products Catalog",
      description:
        "Product management with inventory tracking and detailed product views",
      path: "/products",
      color: "#F59E0B",
      category: "Basic",
    },
    {
      title: "⚙️ Advanced Settings",
      description:
        "Comprehensive configuration management and system preferences",
      path: "/settings",
      color: "#6366F1",
      category: "Configuration",
    },
  ];

  const categories = [
    "All",
    "Analytics",
    "Management",
    "Operations",
    "Basic",
    "Configuration",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFeatures =
    selectedCategory === "All"
      ? features
      : features.filter((f) => f.category === selectedCategory);

  return (
    <main>
      <div id="app">
        <img alt="Webpack logo" src={webpackLogo} />
        <h1 className="heading">
          Welcome to <span>Microfrontend2</span> - Advanced APIs!
        </h1>
        <p>
          This microfrontend showcases advanced enterprise-level features with
          sophisticated analytics, monitoring, and administration tools.
        </p>

        <div
          style={{
            margin: "30px 0",
            padding: "25px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "0 0 15px 0" }}>🎯 Advanced Counter Demo</h2>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              margin: "15px 0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {count}
          </div>
          <div
            style={{ display: "flex", gap: "15px", justifyContent: "center" }}
          >
            <button
              className="btn-primary"
              onClick={decrement}
              style={{
                padding: "12px 24px",
                fontSize: "1.1rem",
                background: "rgba(255,255,255,0.2)",
                border: "2px solid white",
                color: "white",
              }}
            >
              ➖ Decrement
            </button>
            <button
              className="btn-secondary"
              onClick={increment}
              style={{
                padding: "12px 24px",
                fontSize: "1.1rem",
                background: "rgba(255,255,255,0.2)",
                border: "2px solid white",
                color: "white",
              }}
            >
              ➕ Increment
            </button>
          </div>
        </div>

        {/* Feature Categories */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Filter by Category:</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    selectedCategory === category ? "#3B82F6" : "#e5e7eb",
                  color: selectedCategory === category ? "white" : "#374151",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
          🚀 Advanced API Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {filteredFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              style={{
                textDecoration: "none",
                border: `3px solid ${feature.color}`,
                borderRadius: "16px",
                padding: "24px",
                backgroundColor: "white",
                transition: "all 0.3s ease",
                display: "block",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 30px ${feature.color}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Category Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  backgroundColor: feature.color,
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                {feature.category}
              </div>

              {/* Decorative background */}
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: feature.color,
                  borderRadius: "50%",
                  opacity: 0.1,
                }}
              />

              <h3
                style={{
                  color: feature.color,
                  margin: "0 0 15px 0",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "#666",
                  margin: "0 0 20px 0",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                {feature.description}
              </p>
              <div
                style={{
                  padding: "12px 20px",
                  backgroundColor: feature.color,
                  color: "white",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, ${feature.color}, ${feature.color}dd)`,
                }}
              >
                Explore Advanced Features →
              </div>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: "50px",
            padding: "30px",
            background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
            borderRadius: "16px",
            color: "white",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#f7fafc" }}>
            🔧 Advanced Technical Stack
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <strong style={{ color: "#90cdf4" }}>Enterprise Frontend:</strong>
              <br />
              <small>React 18 + TypeScript 5.7 + Advanced Patterns</small>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <strong style={{ color: "#f6ad55" }}>Advanced State:</strong>
              <br />
              <small>TanStack Query v5 + Real-time Updates</small>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <strong style={{ color: "#68d391" }}>Module Federation:</strong>
              <br />
              <small>Webpack 5 + Advanced Federation (Port 3002)</small>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <strong style={{ color: "#b794f6" }}>Enterprise APIs:</strong>
              <br />
              <small>Advanced Analytics + Monitoring + Admin Tools</small>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#1a202c" }}>
            ⚖️ Microfrontend Comparison
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h4 style={{ color: "#3b82f6", margin: "0 0 10px 0" }}>
                Microfrontend 1 (Port 3001)
              </h4>
              <ul style={{ color: "#4a5568", lineHeight: "1.6" }}>
                <li>Basic CRUD Operations</li>
                <li>Simple Analytics Dashboard</li>
                <li>Health Check Monitoring</li>
                <li>User & Category Management</li>
                <li>Standard Settings Panel</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "#8b5cf6", margin: "0 0 10px 0" }}>
                Microfrontend 2 (Port 3002)
              </h4>
              <ul style={{ color: "#4a5568", lineHeight: "1.6" }}>
                <li>Advanced Admin Dashboard</li>
                <li>Enterprise Reports Center</li>
                <li>Deep Analytics with KPIs</li>
                <li>System Monitoring & Audit Logs</li>
                <li>Advanced Configuration Management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
