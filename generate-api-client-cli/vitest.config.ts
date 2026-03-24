import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    testTimeout: 6000,
    hookTimeout: 6000,
    teardownTimeout: 6000,
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.test.ts",
        "**/*.config.*",
        "__tests__/**/*",
      ],
    },
  },
});
