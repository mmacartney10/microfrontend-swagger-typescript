import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import TasksPage from "./components/TasksPage";
import ProductsPage from "./components/ProductsPage";
import OrdersPage from "./components/OrdersPage";
import UsersPage from "./components/UsersPage";
import CategoriesPage from "./components/CategoriesPage";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import HealthCheckDashboard from "./components/HealthCheckDashboard";
import SettingsPage from "./components/SettingsPage";
import QueryProvider from "./providers/QueryProvider";

const RouterlessApp: React.FC = () => {
  const location = useLocation();
  const basePath = "/microfrontend2";

  const navLinks = [
    { path: "", label: "🏠 Home" },
    { path: "/about", label: "ℹ️ About" },
    { path: "/tasks", label: "✅ Tasks" },
    { path: "/products", label: "📦 Products" },
    { path: "/orders", label: "🛒 Orders" },
    { path: "/users", label: "👥 Users" },
    { path: "/categories", label: "🏷️ Categories" },
    { path: "/analytics", label: "📊 Analytics" },
    { path: "/health", label: "🔍 Health" },
    { path: "/settings", label: "⚙️ Settings" },
  ];

  return (
    <QueryProvider>
      <div>
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

        <div style={{ padding: "0 20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/about"
              element={<About msg="React from Microfrontend" />}
            />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/health" element={<HealthCheckDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </QueryProvider>
  );
};

export default RouterlessApp;

// import React from "react";
// import { Route, Routes, Link, useLocation } from "react-router-dom";
// import Home from "./components/Home";
// import About from "./components/About";
// import TasksPage from "./components/TasksPage";
// import ProductsPage from "./components/ProductsPage";
// import OrdersPage from "./components/OrdersPage";
// import UsersPage from "./components/UsersPage";
// import CategoriesPage from "./components/CategoriesPage";
// import AnalyticsDashboard from "./components/AnalyticsDashboard";
// import HealthCheckDashboard from "./components/HealthCheckDashboard";
// import SettingsPage from "./components/SettingsPage";
// import QueryProvider from "./providers/QueryProvider";

// const RouterlessApp: React.FC = () => {
//   const location = useLocation();
//   const basePath = "/microfrontend";

//   const navLinks = [
//     { path: "", label: "🏠 Home" },
//     { path: "/about", label: "ℹ️ About" },
//     { path: "/tasks", label: "✅ Tasks" },
//     { path: "/products", label: "📦 Products" },
//     { path: "/orders", label: "🛒 Orders" },
//     { path: "/users", label: "👥 Users" },
//     { path: "/categories", label: "🏷️ Categories" },
//     { path: "/analytics", label: "📊 Analytics" },
//     { path: "/health", label: "🔍 Health" },
//     { path: "/settings", label: "⚙️ Settings" },
//   ];

//   return (
//     <QueryProvider>
//       <div>
//         <nav
//           style={{
//             padding: "20px",
//             backgroundColor: "#f8fafc",
//             marginBottom: "20px",
//             borderBottom: "2px solid #e2e8f0",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "8px",
//             }}
//           >
//             {navLinks.map(({ path, label }) => (
//               <Link
//                 key={path}
//                 to={`${basePath}${path}`}
//                 style={{
//                   textDecoration: "none",
//                   padding: "8px 16px",
//                   borderRadius: "6px",
//                   backgroundColor:
//                     location.pathname === `${basePath}${path}`
//                       ? "#3b82f6"
//                       : "#e2e8f0",
//                   color:
//                     location.pathname === `${basePath}${path}`
//                       ? "white"
//                       : "#374151",
//                   fontSize: "0.875rem",
//                   fontWeight: "500",
//                   transition: "all 0.2s",
//                   border: "none",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (location.pathname !== `${basePath}${path}`) {
//                     e.currentTarget.style.backgroundColor = "#cbd5e1";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (location.pathname !== `${basePath}${path}`) {
//                     e.currentTarget.style.backgroundColor = "#e2e8f0";
//                   }
//                 }}
//               >
//                 {label}
//               </Link>
//             ))}
//           </div>
//         </nav>

//         <div style={{ padding: "0 20px" }}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route
//               path="/about"
//               element={<About msg="React from Microfrontend" />}
//             />
//             <Route path="/tasks" element={<TasksPage />} />
//             <Route path="/products" element={<ProductsPage />} />
//             <Route path="/orders" element={<OrdersPage />} />
//             <Route path="/users" element={<UsersPage />} />
//             <Route path="/categories" element={<CategoriesPage />} />
//             <Route path="/analytics" element={<AnalyticsDashboard />} />
//             <Route path="/health" element={<HealthCheckDashboard />} />
//             <Route path="/settings" element={<SettingsPage />} />
//           </Routes>
//         </div>
//       </div>
//     </QueryProvider>
//   );
// };

// export default RouterlessApp;
