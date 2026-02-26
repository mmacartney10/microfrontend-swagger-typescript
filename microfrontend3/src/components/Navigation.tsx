import React from "react";
import { Link, useLocation } from "react-router-dom";
import { basePath, navLinks } from "../router";

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        padding: "20px",
        backgroundColor: "#f8fafc",
        marginBottom: "20px",
        borderBottom: "2px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {navLinks.map(({ path, label }) => (
          <Link
            key={path}
            to={`${basePath}${path}`}
            style={{
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              backgroundColor:
                location.pathname === `${basePath}${path}`
                  ? "#3b82f6"
                  : "#e2e8f0",
              color:
                location.pathname === `${basePath}${path}`
                  ? "white"
                  : "#374151",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s",
              border: "none",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== `${basePath}${path}`) {
                e.currentTarget.style.backgroundColor = "#cbd5e1";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== `${basePath}${path}`) {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
