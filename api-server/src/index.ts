import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";
import { getTasks, postTask, putTask } from "./api/tasks";
import { getProducts, getProduct, postProduct } from "./api/products";
import { getOrders, postOrder, getOrder } from "./api/orders";
import { getUsers, postUser, putUser } from "./api/users";
import { getCategories, postCategory, deleteCategory } from "./api/categories";

const app = express();
const PORT = process.env.PORT || 4000; // Different port to avoid conflicts

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Length", "X-Powered-By"],
  }),
);

app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup Swagger documentation
setupSwagger(app);

// Tasks API routes
app.get("/api/tasks", getTasks);
app.post("/api/tasks", postTask);
app.put("/api/tasks/:id", putTask);

// Products API routes
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProduct);
app.post("/api/products", postProduct);

// Orders API routes
app.get("/api/orders", getOrders);
app.post("/api/orders", postOrder);
app.get("/api/orders/:id", getOrder);

// Users API routes
app.get("/api/users", getUsers);
app.post("/api/users", postUser);
app.put("/api/users/:id", putUser);

// Categories API routes
app.get("/api/categories", getCategories);
app.post("/api/categories", postCategory);
app.delete("/api/categories/:id", deleteCategory);

app.listen(PORT, () => {
  console.log(
    `🚀 Microfrontend API Server running on http://localhost:${PORT}`,
  );
  console.log(
    `📖 API Documentation available at http://localhost:${PORT}/api-docs`,
  );
  console.log(
    `📖 API Swagger.json available at http://localhost:${PORT}/swagger.json`,
  );
});
