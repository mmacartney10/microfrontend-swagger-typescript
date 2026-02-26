import React from "react";
import { Route, Routes } from "react-router-dom";
import CategorySystemMonitor from "../components/CategorySystemMonitor";
import OrderUserManager from "../components/OrderUserManager";
import TaskProductManager from "../components/TaskProductManager";

export const basePath = "/microfrontend";

export const navLinks = [
  { path: "", label: "Category System Monitor" },
  { path: "/order", label: "Order User Manager" },
  { path: "/tasks", label: "Task Product Manager" },
];

function AppRouter() {
  return (
    <div style={{ padding: "0 20px" }}>
      <Routes>
        <Route path="/" element={<CategorySystemMonitor />} />
        <Route path="/order" element={<OrderUserManager />} />
        <Route path="/tasks" element={<TaskProductManager />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
