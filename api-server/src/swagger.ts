import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import deepmerge from "deepmerge";

const loadSwaggerFile = (folder: string) => {
  return YAML.load(__dirname + `/${folder}/swagger.yaml`);
};

// Load all API specifications
const tasksApi = loadSwaggerFile("api/tasks");
const productsApi = loadSwaggerFile("api/products");
const ordersApi = loadSwaggerFile("api/orders");
const usersApi = loadSwaggerFile("api/users");
const categoriesApi = loadSwaggerFile("api/categories");

const baseSpec = {
  openapi: "3.0.0",
  info: {
    title: "Microfrontend API Server",
    version: "1.0.0",
    description: "API server for microfrontend architecture demonstration",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "System",
      description: "System health and status endpoints",
    },
  ],
};

// Merge all API specifications
const mergedSpec: Record<string, any> = deepmerge.all(
  [baseSpec, tasksApi, productsApi, ordersApi, usersApi, categoriesApi],
  {
    arrayMerge: (destination, source) => [...destination, ...source],
  },
);

export function setupSwagger(app: express.Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(mergedSpec));

  app.get("/swagger.json", (request, response) => {
    response.json(mergedSpec);
  });
}

export { mergedSpec };
