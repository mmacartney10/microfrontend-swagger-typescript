import React from "react";
import {
  useCategoriesList,
  useCategoriesCreate,
  useUsersList,
  CategoryInput,
} from "@swagger-ts/api-client";
import { categoriesService, usersService } from "../services/api";

const CategoryUserList: React.FC = () => {
  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesList(categoriesService);
  const { data: users, isLoading: usersLoading } = useUsersList(usersService);
  const createCategory = useCategoriesCreate(categoriesService);

  const handleCreateCategory = () => {
    const colors = ["#FF6B6B", "#cd4ea7ff", "#45B7D1", "#96CEB4", "#FFEAA7"];
    const newCategory: CategoryInput = {
      name: `Category ${Date.now()}`,
      description: "Auto-generated category",
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    createCategory.mutate(newCategory);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>📁 Categories</h3>
        <button
          onClick={handleCreateCategory}
          disabled={createCategory.isPending}
          style={{ marginBottom: "10px", padding: "5px 10px" }}
        >
          {createCategory.isPending ? "Creating..." : "Add Category"}
        </button>

        {categoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {categories?.data?.map((category) => (
              <div
                key={category.id}
                style={{
                  padding: "10px",
                  border: "2px solid",
                  borderColor: category.color,
                  borderRadius: "8px",
                  backgroundColor: `${category.color}20`,
                  minWidth: "120px",
                }}
              >
                <strong style={{ color: category.color }}>
                  {category.name}
                </strong>
                <p style={{ margin: "5px 0", fontSize: "12px" }}>
                  {category.description}
                </p>
                <span style={{ fontSize: "11px", color: "#666" }}>
                  {category.productCount} products
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3>👥 Users</h3>
        {usersLoading ? (
          <div>Loading users...</div>
        ) : (
          <div style={{ overflowY: "auto" }}>
            {users?.data?.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  margin: "5px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <span style={{ marginLeft: "10px", color: "#666" }}>
                    @{user.username}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      backgroundColor:
                        user.role === "admin"
                          ? "#ff6b6b"
                          : user.role === "moderator"
                            ? "#4ecdc4"
                            : "#95e1d3",
                      color: "white",
                    }}
                  >
                    {user.role}
                  </span>
                  <span
                    style={{
                      marginLeft: "10px",
                      color: user.active ? "green" : "red",
                    }}
                  >
                    {user.active ? "●" : "○"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryUserList;
