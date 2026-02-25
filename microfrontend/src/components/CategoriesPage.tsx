import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";
import { Category, CategoryInput } from "@swagger-ts/api-client";

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.categoriesService.categoriesList(),
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: CategoryInput) =>
      apiClient.categoriesService.categoriesCreate(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.categoriesService.categoriesDelete({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleCreateCategory = () => {
    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCategory: CategoryInput = {
      name: "Microfrontend Category",
      description: "A category created from the microfrontend application",
      color: randomColor,
      icon: "microfrontend-icon",
      active: true,
    };
    createCategoryMutation.mutate(newCategory);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏷️ Categories Management</h2>

      <button
        onClick={handleCreateCategory}
        disabled={createCategoryMutation.isPending}
        style={{
          backgroundColor: "#06B6D4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        {createCategoryMutation.isPending ? "Creating..." : "Add New Category"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {categories?.data?.map((category) => (
          <div
            key={category.id}
            style={{
              border: `2px solid ${category.color}`,
              borderRadius: "12px",
              padding: "20px",
              backgroundColor: "white",
              opacity: category.active ? 1 : 0.6,
              position: "relative",
            }}
          >
            {/* Category header with color indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: category.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                }}
              >
                {category.icon && (
                  <span style={{ color: "white", fontSize: "1.2em" }}>
                    {category.icon === "microfrontend-icon"
                      ? "⚛️"
                      : category.icon === "electronic-chip"
                        ? "🔌"
                        : category.icon === "home"
                          ? "🏠"
                          : category.icon === "basketball"
                            ? "🏀"
                            : category.icon === "book-open"
                              ? "📖"
                              : category.icon === "academic-cap"
                                ? "🎓"
                                : "📁"}
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px 0" }}>{category.name}</h3>
                {!category.active && (
                  <span
                    style={{
                      backgroundColor: "#EF4444",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.8em",
                    }}
                  >
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <p style={{ margin: "0 0 15px 0", color: "#666" }}>
              {category.description}
            </p>

            {/* Category stats */}
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontSize: "0.9em", color: "#666" }}>
                  Product Count:
                </span>
                <span
                  style={{
                    backgroundColor: category.color,
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                  }}
                >
                  {category.productCount}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.9em", color: "#666" }}>
                  Sort Order:
                </span>
                <span style={{ fontSize: "0.9em", fontWeight: "bold" }}>
                  {category.sortOrder}
                </span>
              </div>
            </div>

            {/* Parent category info */}
            {category.parentId && (
              <div style={{ marginBottom: "15px" }}>
                <span
                  style={{
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "0.8em",
                  }}
                >
                  📁 Child of category #{category.parentId}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.8em", color: "#666" }}>
                {category.createdAt && (
                  <>
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </>
                )}
              </div>

              <button
                onClick={() => handleDeleteCategory(category.id!)}
                disabled={deleteCategoryMutation.isPending}
                style={{
                  backgroundColor: "#EF4444",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#DC2626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EF4444")
                }
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories?.data?.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#666",
            border: "2px dashed #ddd",
            borderRadius: "12px",
          }}
        >
          <h3>No Categories Found</h3>
          <p>Create your first category to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
