import React from "react";
import {
  CategoryInput,
  useCategoriesList,
  useCategoriesCreate,
  useCategoriesDelete,
  useHealthList,
} from "@swagger-ts/api-client";
import { categoriesService, system } from "../services/api";

const CategorySystemMonitor: React.FC = () => {
  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesList(categoriesService);
  const {
    data: health,
    isLoading: healthLoading,
    error: healthError,
  } = useHealthList(system);
  const createCategory = useCategoriesCreate(categoriesService);
  const deleteCategory = useCategoriesDelete(categoriesService);

  const handleCreateCategory = () => {
    const colors = [
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#00bcd4",
      "#009688",
      "#4caf50",
    ];
    const names = [
      "Electronics",
      "Fashion",
      "Home",
      "Sports",
      "Books",
      "Toys",
      "Garden",
      "Auto",
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newCategory: CategoryInput = {
      name: `${randomName} ${Date.now()}`,
      description: `Auto-generated ${randomName.toLowerCase()} category from MF3`,
      color: colors[Math.floor(Math.random() * colors.length)],
      sortOrder: Math.floor(Math.random() * 10),
    };
    createCategory.mutate(newCategory);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      deleteCategory.mutate({ id });
    }
  };

  const getHealthStatus = () => {
    if (healthLoading) return { status: "checking", color: "#ff9800" };
    if (healthError) return { status: "error", color: "#f44336" };
    if (health?.data?.status === "ok")
      return { status: "healthy", color: "#4caf50" };
    return { status: "unknown", color: "#9e9e9e" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div>
      <h3>📁 Category & System Monitor</h3>

      {/* System Health Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
          🟡 System Health
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: healthStatus.color,
            }}
          />
          <span style={{ fontSize: "12px" }}>
            Status: <strong>{healthStatus.status}</strong>
          </span>
          {health?.data?.timestamp && (
            <span style={{ fontSize: "11px", color: "#666" }}>
              Last check: {new Date(health.data.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "14px" }}>
            Categories ({categories?.data?.length || 0})
          </h4>
          <button
            onClick={handleCreateCategory}
            disabled={createCategory.isPending}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              backgroundColor: "#9c27b0",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {createCategory.isPending ? "Creating..." : "Add Category"}
          </button>
        </div>

        {categoriesLoading ? (
          <div style={{ fontSize: "12px" }}>Loading categories...</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
              overflowY: "auto",
            }}
          >
            {categories?.data?.map((category) => (
              <div
                key={category.id}
                style={{
                  padding: "8px",
                  border: `2px solid ${category.color}`,
                  borderRadius: "6px",
                  backgroundColor: `${category.color}10`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: category.color,
                  }}
                >
                  {category.name}
                </div>
                <div
                  style={{ fontSize: "9px", color: "#666", margin: "2px 0" }}
                >
                  {category.productCount} items
                </div>
                <button
                  onClick={() =>
                    handleDeleteCategory(category.id || "", category.name || "")
                  }
                  disabled={deleteCategory.isPending}
                  style={{
                    fontSize: "8px",
                    padding: "2px 4px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySystemMonitor;
