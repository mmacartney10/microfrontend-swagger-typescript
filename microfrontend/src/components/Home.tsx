import React, { useState } from "react";
import { Link } from "react-router-dom";
import webpackLogo from "../assets/webpack.png";

const Home: React.FC = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((count) => count + 1);
  const decrement = () => setCount((count) => count - 1);

  const features = [
    {
      title: "📋 Tasks Management",
      description: "Create, manage, and track task completion with full CRUD operations",
      path: "/tasks",
      color: "#3B82F6"
    },
    {
      title: "📦 Products Catalog",
      description: "Browse products with detailed views and create new product entries",
      path: "/products",
      color: "#10B981"
    },
    {
      title: "🛒 Orders Processing",
      description: "Track orders, view details, and manage order fulfillment",
      path: "/orders",
      color: "#F59E0B"
    },
    {
      title: "👥 User Management",
      description: "Manage users, roles, preferences, and account status",
      path: "/users",
      color: "#8B5CF6"
    },
    {
      title: "🏷️ Categories System",
      description: "Organize content with hierarchical categories and visual indicators",
      path: "/categories",
      color: "#EC4899"
    },
    {
      title: "📊 Analytics Dashboard",
      description: "Comprehensive overview of all data with charts and insights",
      path: "/analytics",
      color: "#06B6D4"
    },
    {
      title: "🔍 Health Monitoring",
      description: "Real-time API health checks with performance metrics",
      path: "/health",
      color: "#EF4444"
    },
    {
      title: "⚙️ Settings & Config",
      description: "Customize application preferences and manage settings",
      path: "/settings",
      color: "#6366F1"
    }
  ];

  return (
    <main>
      <div id="app">
        <img alt="Webpack logo" src={webpackLogo} />
        <h1 className="heading">
          Welcome to the <span>Microfrontend</span> API Demo!
        </h1>
        <p>This application demonstrates TypeScript + React + TanStack Query integration with 8 different API endpoints.</p>

        <div style={{ margin: "30px 0", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <h2>🧮 Counter Demo</h2>
          <p>Count: {count}</p>
          <button className="btn-primary" onClick={decrement} style={{ marginRight: "10px" }}>
            Decrement
          </button>
          <button className="btn-secondary" onClick={increment}>
            Increment
          </button>
        </div>

        <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>🚀 API Features</h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}>
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              style={{
                textDecoration: "none",
                border: `2px solid ${feature.color}`,
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "white",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "block"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 style={{ 
                color: feature.color, 
                margin: "0 0 10px 0",
                fontSize: "1.2rem"
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: "#666", 
                margin: "0",
                lineHeight: "1.5"
              }}>
                {feature.description}
              </p>
              <div style={{
                marginTop: "15px",
                padding: "8px 16px",
                backgroundColor: feature.color,
                color: "white",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}>
                Explore →
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#1f2937",
          borderRadius: "8px",
          color: "white"
        }}>
          <h3>🔧 Technical Stack</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "15px"
          }}>
            <div>
              <strong>Frontend:</strong>
              <br />
              <small>React 18 + TypeScript 5.7</small>
            </div>
            <div>
              <strong>State Management:</strong>
              <br />
              <small>TanStack Query v5</small>
            </div>
            <div>
              <strong>Module Federation:</strong>
              <br />
              <small>Webpack 5 + Babel</small>
            </div>
            <div>
              <strong>API Client:</strong>
              <br />
              <small>@swagger-ts/api-client</small>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
