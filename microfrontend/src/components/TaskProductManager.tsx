import React, { useState } from "react";
import { Task, TaskInput, ProductInput } from "@swagger-ts/api-client-two";
import {
  useTasksList,
  useTasksCreate,
  useTasksUpdate,
  useProductsList,
  useProductsDetail,
  useProductsCreate,
} from "../hooks";

const TaskProductManager: React.FC = () => {
  const { data: tasks, isLoading: tasksLoading } = useTasksList();
  const { data: products, isLoading: productsLoading } = useProductsList();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const { data: selectedProduct } = useProductsDetail({
    id: selectedProductId,
  });

  const createTask = useTasksCreate();
  const updateTask = useTasksUpdate();
  const createProduct = useProductsCreate();

  const handleCreateTask = () => {
    const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    const newTask: TaskInput = {
      title: `Task ${Date.now()}`,
      description: "Auto-generated task from MF3",
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      completed: false,
    };
    createTask.mutate(newTask);
  };

  const handleToggleTask = (task: Task) => {
    if (task.id && task.title) {
      updateTask.mutate({
        params: { id: task.id },
        data: {
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          completed: !task.completed,
        },
      });
    }
  };

  const handleCreateProduct = () => {
    const categories = ["Electronics", "Books", "Clothing", "Home", "Sports"];
    const newProduct: ProductInput = {
      name: `Product ${Date.now()}`,
      description: "Premium auto-generated product",
      price: Math.floor(Math.random() * 500) + 50,
      category: categories[Math.floor(Math.random() * categories.length)],
      inStock: Math.random() > 0.3,
      tags: ["premium", "auto-generated", "mf3"],
    };
    createProduct.mutate(newProduct);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>📅 Task & Product Manager</h3>

      {/* Tasks Section */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Tasks ({tasks?.data?.length || 0})</h4>
        <button
          onClick={handleCreateTask}
          disabled={createTask.isPending}
          style={{
            marginBottom: "10px",
            padding: "5px 10px",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {createTask.isPending ? "Creating..." : "Add Task"}
        </button>

        {tasksLoading ? (
          <div>Loading tasks...</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              overflowY: "auto",
            }}
          >
            {tasks?.data?.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: task.completed ? "#e8f5e8" : "white",
                  minWidth: "150px",
                  cursor: "pointer",
                }}
                onClick={() => handleToggleTask(task)}
              >
                <strong>{task.title}</strong>
                <div style={{ fontSize: "11px", color: "#666" }}>
                  {task.priority} • {task.completed ? "✓ Done" : "⏳ Pending"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div>
        <h4>Products ({products?.data?.length || 0})</h4>
        <button
          onClick={handleCreateProduct}
          disabled={createProduct.isPending}
          style={{
            marginBottom: "10px",
            padding: "5px 10px",
            backgroundColor: "#3f51b5",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {createProduct.isPending ? "Creating..." : "Add Product"}
        </button>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            {productsLoading ? (
              <div>Loading products...</div>
            ) : (
              <div style={{ overflowY: "auto" }}>
                {products?.data?.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    style={{
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      margin: "2px 0",
                      cursor: "pointer",
                      backgroundColor:
                        selectedProductId === product.id ? "#e3f2fd" : "white",
                      fontSize: "12px",
                    }}
                    onClick={() => setSelectedProductId(product.id || "")}
                  >
                    <strong>{product.name}</strong> - ${product.price}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {selectedProduct?.data ? (
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <h5 style={{ margin: "0 0 5px 0" }}>
                  {selectedProduct.data.name}
                </h5>
                <p style={{ margin: "2px 0" }}>${selectedProduct.data.price}</p>
                <p style={{ margin: "2px 0" }}>
                  {selectedProduct.data.category}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: "12px", color: "#666" }}>
                Select a product
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskProductManager;
