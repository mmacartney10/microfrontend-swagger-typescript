import React from "react";
import { Route, Routes } from "react-router-dom";
import CategoryUserList from "../components/CategoryUserList";
import ProductList from "../components/ProductList";
import TaskList from "../components/TaskList";

export const basePath = "/microfrontend3";

export const navLinks = [
  { path: "", label: "User list" },
  { path: "/products", label: "Products" },
  { path: "/tasks", label: "Task list" },
];

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CategoryUserList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/tasks" element={<TaskList />} />
    </Routes>
  );
}

export default AppRouter;
