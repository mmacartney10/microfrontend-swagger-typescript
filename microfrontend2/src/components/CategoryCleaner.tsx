import React from "react";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";

const CategoryCleaner: React.FC = () => {
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory.mutate(id);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {String(error)}</div>;

  return (
    <div>
      <h3>🗂️ Category Management</h3>
      <p style={{ fontSize: "12px", color: "#666" }}>
        ⚠️ Careful! This tool allows you to delete categories.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        {categories?.data?.map((category) => (
          <div
            key={category.id}
            style={{
              padding: "10px",
              border: "2px solid",
              borderColor: category.color,
              borderRadius: "8px",
              backgroundColor: `${category.color}15`,
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong style={{ color: category.color }}>{category.name}</strong>
              <p style={{ margin: "5px 0", fontSize: "12px" }}>
                {category.description}
              </p>
              <span style={{ fontSize: "11px", color: "#666" }}>
                {category.productCount} products
              </span>
            </div>
            <button
              onClick={() =>
                handleDeleteCategory(category.id || "", category.name || "")
              }
              disabled={deleteCategory.isPending}
              style={{
                marginTop: "8px",
                padding: "4px 8px",
                fontSize: "11px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {deleteCategory.isPending ? "Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCleaner;
