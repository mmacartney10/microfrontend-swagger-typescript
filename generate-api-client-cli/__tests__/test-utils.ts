import { rm, access } from "fs/promises";
import { join } from "path";
import { createServer, Server } from "http";
import { execa } from "execa";
import {
  getDefaultSwaggerContent,
  getSwaggerWithAdditions,
  getSwaggerWithRemovals,
  getSwaggerWithModifications,
} from "./swagger-mocks.js";

export interface CLITestResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  outputDir: string;
}

export interface CLITestOptions {
  swaggerUrl?: string;
  outputDir?: string;
  skipPrompts?: boolean;
  env?: Record<string, string>;
  userInput?: string;
}

// Global test server store
let testServer: Server | null = null;

/**
 * Starts a mock HTTP server for testing
 */
export async function startMockServer(): Promise<{
  server: Server;
  port: number;
  baseUrl: string;
}> {
  const server = createServer((req, res) => {
    const url = req.url || "/";

    // Enable CORS for testing
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    // Default responses based on path patterns
    if (url.includes("swagger.json")) {
      if (url.includes("success") || url === "/swagger.json") {
        // Return default swagger content
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getDefaultSwaggerContent()));
      } else if (url.includes("additions")) {
        // Return swagger with added content
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getSwaggerWithAdditions()));
      } else if (url.includes("removals")) {
        // Return swagger with removed content
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getSwaggerWithRemovals()));
      } else if (url.includes("modifications")) {
        // Return swagger with modified content
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getSwaggerWithModifications()));
      } else if (url.includes("notfound") || url.includes("404")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
      } else if (url.includes("error") || url.includes("500")) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      } else {
        // Default success case
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getDefaultSwaggerContent()));
      }
    } else {
      // 404 for unknown paths
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Failed to start server"));
        return;
      }

      const actualPort = address.port;
      const baseUrl = `http://localhost:${actualPort}`;

      resolve({ server, port: actualPort, baseUrl });
    });

    server.on("error", reject);
  });
}

/**
 * Stops the mock HTTP server
 */
export async function stopMockServer(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

/**
 * Sets up the test server and stores reference
 */
export async function setupTestServer(): Promise<{
  port: number;
  baseUrl: string;
}> {
  if (testServer) {
    await stopMockServer(testServer);
  }

  const result = await startMockServer();
  testServer = result.server;
  return { port: result.port, baseUrl: result.baseUrl };
}

/**
 * Tears down the test server
 */
export async function teardownTestServer(): Promise<void> {
  if (testServer) {
    await stopMockServer(testServer);
    testServer = null;
  }
}
/**
 * Cleans up a temporary directory and all its contents
 */
export async function cleanupTempDir(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Warning: Failed to cleanup temp dir ${tempDir}:`, error);
  }
}

/**
 * Unified CLI execution function using execa - handles both interactive and non-interactive modes
 */
export async function runCLI(
  options: CLITestOptions = {},
): Promise<CLITestResult> {
  const {
    swaggerUrl = "http://localhost:3000/swagger.json",
    outputDir,
    skipPrompts = false,
    env = {},
    userInput,
  } = options;

  if (!outputDir) {
    throw new Error("outputDir is required for CLI tests");
  }

  try {
    const cliPath = join(process.cwd(), "dist", "bin", "index.js");

    // Build command arguments
    const args = ["--swagger-url", swaggerUrl, "--output-dir", outputDir];

    // Add non-interactive flag if skipPrompts is true
    if (skipPrompts) {
      args.push("--non-interactive");
    }

    const execaOptions: any = {
      env: { ...process.env, NODE_ENV: "test", ...env },
      cwd: process.cwd(),
      reject: false, // Don't throw on non-zero exit codes
      timeout: 45000, // Use global timeout from vitest config
    };

    // Add user input if provided (for interactive mode)
    if (userInput) {
      execaOptions.input = userInput;
    }

    const result = await execa("node", [cliPath, ...args], execaOptions);

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      exitCode: result.exitCode ?? 0,
      outputDir,
    };
  } catch (error: any) {
    return {
      stdout: "",
      stderr: error.message || "Execution failed",
      exitCode: error.exitCode || 1,
      outputDir,
    };
  }
}

/**
 * Checks if specific files exist in the output directory
 */
export async function checkOutputFiles(outputDir: string): Promise<{
  swagger: boolean;
  api: boolean;
  metadata: boolean;
  queryAbstractions: boolean;
  queryIndex: boolean;
}> {
  const checkFile = async (filePath: string): Promise<boolean> => {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  };

  return {
    swagger: await checkFile(join(outputDir, "swagger.json")),
    api: await checkFile(join(outputDir, "Api.ts")),
    metadata: await checkFile(join(outputDir, "services-metadata.ts")),
    queryAbstractions: await checkFile(join(outputDir, "query-abstractions")),
    queryIndex: await checkFile(
      join(outputDir, "query-abstractions", "index.ts"),
    ),
  };
}

/**
 * Checks which query abstraction service files exist in the output directory
 */
export async function checkQueryAbstractionFiles(outputDir: string): Promise<{
  users: boolean;
  products: boolean;
  health: boolean;
  index: boolean;
}> {
  const checkFile = async (filePath: string): Promise<boolean> => {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  };

  const queryDir = join(outputDir, "query-abstractions");

  return {
    users: await checkFile(join(queryDir, "users.ts")),
    products: await checkFile(join(queryDir, "products.ts")),
    health: await checkFile(join(queryDir, "health.ts")),
    index: await checkFile(join(queryDir, "index.ts")),
  };
}
