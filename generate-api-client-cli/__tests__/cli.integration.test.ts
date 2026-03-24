import { describe, test, beforeEach, afterEach, expect } from "vitest";
import { join } from "path";
import { readFile } from "fs/promises";
import {
  runCLI,
  cleanupTempDir,
  checkOutputFiles,
  checkQueryAbstractionFiles,
  setupTestServer,
  teardownTestServer,
} from "./test-utils.js";

describe("CLI Integration Tests", () => {
  let testOutputDir: string;
  let testServerInfo: { port: number; baseUrl: string };

  beforeEach(async () => {
    testOutputDir = join(process.cwd(), "test-output");
    await cleanupTempDir(testOutputDir);
    testServerInfo = await setupTestServer();
  });

  afterEach(async () => {
    await teardownTestServer();
    await cleanupTempDir(testOutputDir);
  });

  describe("Basic CLI functionality", () => {
    test("should successfully run CLI with test swagger server", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;

      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);
      expect(result.outputDir).toBe(testOutputDir);

      const files = await checkOutputFiles(testOutputDir);
      expect(files.swagger).toBe(true);
    });

    test("should handle swagger fetch errors gracefully", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/notfound/swagger.json`;

      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).not.toBe(0);

      const output = result.stderr || result.stdout;
      expect(output).toMatch(
        /failed to fetch|fetch failed|not found|404|ECONNREFUSED/i,
      );
    });

    test("should create output directory structure", async () => {
      const files = await checkOutputFiles(testOutputDir);

      expect(files.swagger).toBe(false);
      expect(files.api).toBe(false);
      expect(files.metadata).toBe(false);
      expect(files.queryAbstractions).toBe(false);
      expect(files.queryIndex).toBe(false);
    });
  });

  describe("No Changes Scenario", () => {
    test("should handle subsequent runs with identical swagger content", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      const filesAfterFirst = await checkOutputFiles(testOutputDir);
      expect(filesAfterFirst.swagger).toBe(true);
      expect(filesAfterFirst.api).toBe(true);
      expect(filesAfterFirst.metadata).toBe(true);

      const { readFile } = await import("fs/promises");
      const generatedSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const generatedApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(secondRun.exitCode).toBe(0);

      const filesAfterSecond = await checkOutputFiles(testOutputDir);
      expect(filesAfterSecond.swagger).toBe(true);
      expect(filesAfterSecond.api).toBe(true);
      expect(filesAfterSecond.metadata).toBe(true);

      const secondSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const secondApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      expect(secondSwaggerContent).toBe(generatedSwaggerContent);
      expect(secondApiContent).toBe(generatedApiContent);

      const secondRunOutput = secondRun.stdout + secondRun.stderr;

      expect(secondRunOutput).toMatch(/No changes detected in Swagger spec/i);

      expect(firstRun.stdout).toMatch(/Generated swagger\.json/);
      expect(secondRun.stdout).not.toMatch(/Generated swagger\.json/);

      expect(secondRun.stdout).toMatch(/Generated api\.ts/);
      expect(secondRun.stdout).toMatch(/Generated services-metadata\.ts/);
    });
  });

  describe("Swagger Changes Scenario", () => {
    test("should handle swagger with additions (new endpoints, schemas, operations)", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const additionsSwaggerUrl = `${testServerInfo.baseUrl}/additions/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      const filesAfterFirst = await checkOutputFiles(testOutputDir);
      expect(filesAfterFirst.swagger).toBe(true);
      expect(filesAfterFirst.api).toBe(true);
      expect(filesAfterFirst.metadata).toBe(true);

      const { readFile } = await import("fs/promises");
      const originalSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: additionsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const filesAfterSecond = await checkOutputFiles(testOutputDir);
      expect(filesAfterSecond.swagger).toBe(true);
      expect(filesAfterSecond.api).toBe(true);
      expect(filesAfterSecond.metadata).toBe(true);

      const newSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const newApiContent = await readFile(`${testOutputDir}/Api.ts`, "utf8");

      expect(newSwaggerContent).not.toBe(originalSwaggerContent);
      expect(newApiContent).not.toBe(originalApiContent);

      const swaggerData = JSON.parse(newSwaggerContent);
      expect(swaggerData.paths).toHaveProperty("/products");
      expect(swaggerData.paths).toHaveProperty("/users/{id}");
      expect(swaggerData.components.schemas).toHaveProperty("Product");
      expect(swaggerData.info.version).toBe("2.0.0");

      expect(newApiContent).toMatch(/getProducts/);
      expect(newApiContent).toMatch(/createProduct/);
      expect(newApiContent).toMatch(/getUserById/);
      expect(newApiContent).toMatch(/Product/);

      const secondRunOutput = secondRun.stdout + secondRun.stderr;
      expect(secondRunOutput).not.toMatch(/No changes detected/);
      expect(secondRunOutput).toMatch(
        /Updated swagger\.json|Generated swagger\.json/,
      );
    });

    test("should handle swagger with removals (removed endpoints, schemas)", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const removalsSwaggerUrl = `${testServerInfo.baseUrl}/removals/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);
      const { readFile } = await import("fs/promises");
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: removalsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const newSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const newApiContent = await readFile(`${testOutputDir}/Api.ts`, "utf8");

      expect(newApiContent).not.toBe(originalApiContent);

      const swaggerData = JSON.parse(newSwaggerContent);
      expect(swaggerData.paths).not.toHaveProperty("/users");
      expect(swaggerData.paths).toHaveProperty("/health");
      expect(swaggerData.components.schemas).not.toHaveProperty("User");
      expect(swaggerData.info.version).toBe("0.5.0");

      expect(newApiContent).not.toMatch(/getUsers/);
      expect(newApiContent).not.toMatch(/createUser/);
      expect(newApiContent).toMatch(/healthCheck/);
    });

    test("should handle swagger with modifications (changed operations, schemas)", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);
      const { readFile } = await import("fs/promises");
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: modificationsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const newSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const newApiContent = await readFile(`${testOutputDir}/Api.ts`, "utf8");

      expect(newApiContent).not.toBe(originalApiContent);

      const swaggerData = JSON.parse(newSwaggerContent);
      expect(swaggerData.info.version).toBe("1.1.0");
      expect(swaggerData.info.description).toBe("Modified Test API");

      expect(swaggerData.paths["/users"].get.parameters).toBeDefined();
      expect(swaggerData.paths["/users"].get.parameters).toHaveLength(2);
      expect(swaggerData.paths["/users"]).toHaveProperty("put");

      expect(swaggerData.components.schemas.User.properties).toHaveProperty(
        "phone",
      );
      expect(swaggerData.components.schemas.User.properties).toHaveProperty(
        "createdAt",
      );
      expect(swaggerData.components.schemas.User.properties).toHaveProperty(
        "isActive",
      );
      expect(swaggerData.components.schemas.User.required).toBeDefined();
      expect(swaggerData.components.schemas).toHaveProperty(
        "CreateUserRequest",
      );

      expect(newApiContent).toMatch(/UpdateUser/);
      expect(newApiContent).toMatch(/CreateUserRequest/);
      expect(newApiContent).toMatch(/page\?:/);
      expect(newApiContent).toMatch(/limit\?:/);
    });

    test("should prompt user to accept changes in interactive mode and accept", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const additionsSwaggerUrl = `${testServerInfo.baseUrl}/additions/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: additionsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const newSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const newApiContent = await readFile(`${testOutputDir}/Api.ts`, "utf8");

      expect(newApiContent).not.toBe(originalApiContent);

      const secondRunOutput = secondRun.stdout + secondRun.stderr;
      expect(secondRunOutput).toMatch(
        /Do you want to proceed with these changes/,
      );
      expect(secondRunOutput).toMatch(
        /Updated swagger\.json|Generated swagger\.json/,
      );

      const swaggerData = JSON.parse(newSwaggerContent);
      expect(swaggerData.paths).toHaveProperty("/products");
      expect(swaggerData.info.version).toBe("2.0.0");
    });

    test("should always require user confirmation for changes", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: modificationsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const swaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const swaggerData = JSON.parse(swaggerContent);

      expect(swaggerData.info.version).toBe("1.1.0");
      expect(swaggerData.info.description).toBe("Modified Test API");

      const secondRunOutput = secondRun.stdout + secondRun.stderr;
      expect(secondRunOutput).toMatch(
        /Do you want to proceed with these changes/,
      );
      expect(secondRunOutput).toMatch(
        /Updated swagger\.json|Generated swagger\.json/,
      );
    });
  });

  describe("Interactive User Prompts", () => {
    test("should prompt user and accept changes when user responds 'yes'", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const additionsSwaggerUrl = `${testServerInfo.baseUrl}/additions/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: additionsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      expect(secondRun.exitCode).toBe(0);

      const newSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const newApiContent = await readFile(`${testOutputDir}/Api.ts`, "utf8");

      expect(newApiContent).not.toBe(originalApiContent);

      const output = secondRun.stdout + secondRun.stderr;
      expect(output).toMatch(/Do you want to proceed with these changes/);
      expect(output).toMatch(/Updated swagger\.json|Generated swagger\.json/);

      const swaggerData = JSON.parse(newSwaggerContent);
      expect(swaggerData.paths).toHaveProperty("/products");
      expect(swaggerData.info.version).toBe("2.0.0");
    });

    test("should prompt user and reject changes when user responds 'no'", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;
      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const originalSwaggerContent = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const originalApiContent = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: modificationsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "n\n",
      });

      expect(secondRun.exitCode).toBe(1);

      const swaggerContentAfterReject = await readFile(
        `${testOutputDir}/swagger.json`,
        "utf8",
      );
      const apiContentAfterReject = await readFile(
        `${testOutputDir}/Api.ts`,
        "utf8",
      );

      expect(swaggerContentAfterReject).toBe(originalSwaggerContent);
      expect(apiContentAfterReject).toBe(originalApiContent);

      const output = secondRun.stdout + secondRun.stderr;
      expect(output).toMatch(/Do you want to proceed with these changes/);
      expect(output).toMatch(/Generation cancelled.*swagger\.json not updated/);
    });

    test("should show detailed change summary before prompting user", async () => {
      const baseSwaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;

      const firstRun = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: baseSwaggerUrl,
        skipPrompts: true,
      });

      expect(firstRun.exitCode).toBe(0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const secondRun = await runCLI({
        swaggerUrl: modificationsSwaggerUrl,
        outputDir: testOutputDir,
        userInput: "y\n",
      });

      const output = secondRun.stdout + secondRun.stderr;

      expect(output).toMatch(/Swagger changes detected/);
      expect(output).toMatch(/Added paths:|removed|modified/);
      expect(output).toMatch(/Do you want to proceed with these changes/);

      expect(output).toMatch(
        /info\.version|info\.description|paths|components/,
      );
    });
  });

  describe("Query Abstractions Content Validation", () => {
    test("should generate all expected output files and directories", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const outputFiles = await checkOutputFiles(testOutputDir);
      expect(outputFiles.swagger).toBe(true);
      expect(outputFiles.api).toBe(true);
      expect(outputFiles.metadata).toBe(true);
      expect(outputFiles.queryAbstractions).toBe(true);
      expect(outputFiles.queryIndex).toBe(true);

      const queryFiles = await checkQueryAbstractionFiles(testOutputDir);
      expect(queryFiles.users).toBe(true);
      expect(queryFiles.index).toBe(true);
    });

    test("should generate correct GET methods without path parameters", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(
        /import.*queryOptions.*mutationOptions.*from.*@tanstack\/react-query/,
      );
      expect(usersQueryContent).toMatch(/import.*Api.*from.*\.\.\/Api/);
      expect(usersQueryContent).toMatch(/type Users = Api<any>\["users"\]/);
      expect(usersQueryContent).toMatch(/export const QUERY_KEYS_USERS = \{/);
      expect(usersQueryContent).toMatch(/getUsers: \["getUsers"\]/);
      expect(usersQueryContent).toMatch(
        /export const getUsersOptions = \(service: Users\)/,
      );
      expect(usersQueryContent).toMatch(/queryOptions\(\{/);
      expect(usersQueryContent).toMatch(/queryKey: QUERY_KEYS_USERS\.getUsers/);
      expect(usersQueryContent).toMatch(
        /queryFn: \(\) => service\.getUsers\(\)/,
      );
    });

    test("should generate correct POST methods (mutation options)", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(
        /export const createUserOptions = \(service: Users\)/,
      );
      expect(usersQueryContent).toMatch(/mutationOptions\(\{/);
      expect(usersQueryContent).toMatch(/mutationFn: \(data:/);
      expect(usersQueryContent).toMatch(/service\.createUser\(data\)/);
    });

    test("should generate correct GET methods with path parameters and query params", async () => {
      const additionsSwaggerUrl = `${testServerInfo.baseUrl}/additions/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: additionsSwaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(
        /getUserById: \(id: string\) => \["getUserById", id\] as const/,
      );
      expect(usersQueryContent).toMatch(
        /export const getUserByIdOptions = \(service: Users, params:/,
      );
      expect(usersQueryContent).toMatch(
        /queryKey: QUERY_KEYS_USERS\.getUserById\(params\.id\)/,
      );
      expect(usersQueryContent).toMatch(
        /queryFn: \(\) => service\.getUserById\(params\)/,
      );

      const productsQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/products.ts`,
        "utf8",
      );

      expect(productsQueryContent).toMatch(
        /type Products = Api<any>\["products"\]/,
      );
      expect(productsQueryContent).toMatch(/QUERY_KEYS_PRODUCTS/);
      expect(productsQueryContent).toMatch(/getProducts:/);
    });

    test("should generate correct PUT/PATCH methods with params and data", async () => {
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: modificationsSwaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(
        /export const updateUserOptions = \(service: Users\)/,
      );
      expect(usersQueryContent).toMatch(/mutationOptions\(\{/);
      expect(usersQueryContent).toMatch(/mutationFn: \(\{ params, data \}:/);
      expect(usersQueryContent).toMatch(/service\.updateUser\(params, data\)/);
      expect(usersQueryContent).toMatch(
        /export const getUsersOptions = \(service: Users, params:/,
      );
      expect(usersQueryContent).toMatch(/service\.getUsers\(params\)/);
    });

    test("should generate correct DELETE methods", async () => {
      const modificationsSwaggerUrl = `${testServerInfo.baseUrl}/modifications/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: modificationsSwaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(/mutationOptions/);
      expect(usersQueryContent).toMatch(/mutationFn:/);
      expect(usersQueryContent).toMatch(/service\.\w+\(/);
    });

    test("should generate correct index.ts file that exports all services", async () => {
      const additionsSwaggerUrl = `${testServerInfo.baseUrl}/additions/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: additionsSwaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const indexContent = await readFile(
        `${testOutputDir}/query-abstractions/index.ts`,
        "utf8",
      );

      expect(indexContent).toMatch(/export \* from ["']\.\/users["'];/);
      expect(indexContent).toMatch(/export \* from ["']\.\/products["'];/);
      expect(indexContent).toMatch(/Auto-generated React Query options/i);
    });

    test("should generate minimal API correctly after removals", async () => {
      const removalsSwaggerUrl = `${testServerInfo.baseUrl}/removals/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: removalsSwaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const queryFiles = await checkQueryAbstractionFiles(testOutputDir);
      expect(queryFiles.health).toBe(true);
      expect(queryFiles.users).toBe(false);
      expect(queryFiles.products).toBe(false);
      expect(queryFiles.index).toBe(true);

      const { readFile } = await import("fs/promises");

      const healthQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/health.ts`,
        "utf8",
      );

      expect(healthQueryContent).toMatch(/type Health = Api<any>\["health"\]/);
      expect(healthQueryContent).toMatch(/QUERY_KEYS_HEALTH = \{/);
      expect(healthQueryContent).toMatch(/healthCheck:/);
      expect(healthQueryContent).toMatch(
        /export const healthCheckOptions = \(service: Health\)/,
      );
      expect(healthQueryContent).toMatch(
        /queryFn: \(\) => service\.healthCheck\(\)/,
      );

      const indexContent = await readFile(
        `${testOutputDir}/query-abstractions/index.ts`,
        "utf8",
      );
      expect(indexContent).toMatch(/export \* from ["']\.\/health["'];/);
      expect(indexContent).not.toMatch(/users/);
      expect(indexContent).not.toMatch(/products/);
    });

    test("should validate query abstractions template variables and imports", async () => {
      const swaggerUrl = `${testServerInfo.baseUrl}/swagger.json`;
      const result = await runCLI({
        outputDir: testOutputDir,
        swaggerUrl: swaggerUrl,
        skipPrompts: true,
      });

      expect(result.exitCode).toBe(0);

      const { readFile } = await import("fs/promises");
      const usersQueryContent = await readFile(
        `${testOutputDir}/query-abstractions/users.ts`,
        "utf8",
      );

      expect(usersQueryContent).toMatch(/type Users =/);
      expect(usersQueryContent).toMatch(/QUERY_KEYS_USERS/);
      expect(usersQueryContent).toMatch(/service: Users/);
      expect(usersQueryContent).toMatch(/queryKey:/);
      expect(usersQueryContent).toMatch(/queryFn:/);
      expect(usersQueryContent).toMatch(/mutationFn:/);
      expect(usersQueryContent).toMatch(
        /import \{ .*Api.* \} from "\.\.\/Api"/,
      );
    });
  });
});
