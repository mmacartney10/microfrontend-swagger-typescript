/**
 * Default swagger content for testing
 */
export function getDefaultSwaggerContent() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
    paths: {
      "/users": {
        get: {
          operationId: "getUsers",
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: "createUser",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
  };
}

// Swagger variations for testing changes
export function getSwaggerWithAdditions() {
  const baseSwagger = getDefaultSwaggerContent();
  return {
    ...baseSwagger,
    info: {
      ...baseSwagger.info,
      version: "2.0.0", // Version bump to indicate changes
    },
    paths: {
      ...baseSwagger.paths,
      // Added new endpoint
      "/products": {
        get: {
          operationId: "getProducts",
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: "createProduct",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          responses: {
            "201": { description: "Created" },
          },
        },
      },
      // Added new operation to existing endpoint
      "/users/{id}": {
        get: {
          operationId: "getUserById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ...baseSwagger.components.schemas,
        // Added new schema
        Product: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
          },
        },
      },
    },
  };
}

export function getSwaggerWithRemovals() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "0.5.0", // Version change to indicate removals
    },
    paths: {
      // Removed /users endpoint entirely
      // Only keeping a minimal API
      "/health": {
        get: {
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      timestamp: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        // Removed User schema
        // No schemas needed for health check
      },
    },
  };
}

export function getSwaggerWithModifications() {
  const baseSwagger = getDefaultSwaggerContent();
  return {
    ...baseSwagger,
    info: {
      ...baseSwagger.info,
      version: "1.1.0", // Version bump for modifications
      description: "Modified Test API", // Added description
    },
    paths: {
      "/users": {
        get: {
          operationId: "getUsers",
          // Added query parameters
          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "number", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "number", default: 10 },
            },
          ],
          responses: {
            "200": {
              description: "Paginated users list", // Modified description
              content: {
                "application/json": {
                  schema: {
                    type: "object", // Changed from array to paginated object
                    properties: {
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "number" },
                          limit: { type: "number" },
                          total: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: "createUser",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserRequest" }, // Changed schema reference
              },
            },
          },
          responses: {
            "201": { description: "User created successfully" }, // Modified description
            "400": { description: "Invalid input" }, // Added error response
          },
        },
        // Added PUT operation
        put: {
          operationId: "updateUser",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          responses: {
            "200": { description: "User updated successfully" },
            "404": { description: "User not found" },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
            // Added new properties
            phone: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            isActive: { type: "boolean", default: true },
          },
          required: ["id", "name", "email"], // Added required fields
        },
        // Added new schema for creation
        CreateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
          },
          required: ["name", "email"],
        },
      },
    },
  };
}
