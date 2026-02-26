import React from "react";
import { Route, Routes } from "react-router-dom";
import CategoryCleaner from "../components/CategoryCleaner";
import OrderManager from "../components/OrderManager";
import ProductViewer from "../components/ProductViewer";
import UserManager from "../components/UserManager";

export const basePath = "/microfrontend2";

export const navLinks = [
  { path: "", label: "Category Cleaner" },
  { path: "/orders", label: "Order Manager" },
  { path: "/products", label: "Product Viewer" },
  { path: "/tasks", label: "User Manager" },
];

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CategoryCleaner />} />
      <Route path="/orders" element={<OrderManager />} />
      <Route path="/products" element={<ProductViewer />} />
      <Route path="/tasks" element={<UserManager />} />
    </Routes>
  );
}

export default AppRouter;
