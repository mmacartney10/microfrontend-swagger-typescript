import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import Navbar from "../components/Navbar";
import TasksPage from "../components/TasksPage";
import ProductsPage from "../components/ProductsPage";
import OrdersPage from "../components/OrdersPage";
import UsersPage from "../components/UsersPage";
import CategoriesPage from "../components/CategoriesPage";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import HealthCheckDashboard from "../components/HealthCheckDashboard";
import SettingsPage from "../components/SettingsPage";

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About msg="React" />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/health" element={<HealthCheckDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
