#!/usr/bin/env npx ts-node

import { Command } from "commander";
import * as path from "path";
import * as fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { promisify } from "util";

const wait = promisify(setTimeout);

interface CLIOptions {
  swaggerUrl: string;
  output: string;
}

// Function to check if files exist
function waitForFiles(
  filePaths: string[],
  maxWait: number = 30000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkFiles = () => {
      const allExist = filePaths.every((filePath) => fs.existsSync(filePath));

      if (allExist) {
        resolve();
      } else if (Date.now() - startTime > maxWait) {
        reject(
          new Error(
            `Timeout waiting for files: ${filePaths.filter((p) => !fs.existsSync(p)).join(", ")}`,
          ),
        );
      } else {
        setTimeout(checkFiles, 100); // Check every 100ms
      }
    };

    checkFiles();
  });
}

// Function to run a script and wait for completion
function runScript(
  scriptPath: string,
  env: Record<string, string> = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child: ChildProcess = spawn(
      "ts-node",
      ["--compiler-options", '{"module":"commonjs"}', scriptPath],
      {
        stdio: "inherit",
        cwd: process.cwd(),
        env: { ...process.env, ...env },
      },
    );

    child.on("close", (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function generateAll(options: CLIOptions) {
  const outputDir = path.resolve(options.output);
  const apiFilePath = path.resolve(outputDir, "./Api.ts");
  const metadataFilePath = path.resolve(outputDir, "./services-metadata.ts");

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Set environment variables for the generation scripts
  const env = {
    SWAGGER_DOCS_URL: options.swaggerUrl,
    OUTPUT_DIR: outputDir,
  };

  try {
    console.log(`🔄 Generating API client to: ${outputDir}`);
    console.log(`📡 Using Swagger URL: ${options.swaggerUrl}`);

    // Step 0: Validate Swagger changes
    console.log("🔍 Validating Swagger changes...");
    await runScript("./src/validate-swagger.ts", env);
    console.log("✅ Swagger validation completed");

    // Step 1: Run generate-api.ts
    console.log("⏳ Generating API from Swagger...");
    await runScript("./src/generate-api.ts", env);
    console.log("✅ API generation completed");

    // Step 2: Wait for output files to be created
    console.log("⏳ Waiting for output files...");
    await waitForFiles([apiFilePath, metadataFilePath]);
    console.log("✅ Output files detected");

    // Step 3: Run generate-query-abstractions.ts
    console.log("⏳ Generating React Query abstractions...");
    await runScript("./src/generate-query-abstractions.ts", env);
    console.log("✅ Query abstractions generation completed");

    // Step 4: Generate main index.ts in output folder
    console.log("📝 Generating main index.ts...");
    const mainIndexContent = `// Auto-generated exports

// Export everything from the generated API
export * from "./Api";

// Export all React Query abstractions
export * from "./query-abstractions";
`;
    fs.writeFileSync(path.resolve(outputDir, "index.ts"), mainIndexContent);
    console.log("✅ Main index.ts generated");

    // Step 5: Verify all expected files exist
    const expectedFiles = [
      path.resolve(outputDir, "./Api.ts"),
      path.resolve(outputDir, "./services-metadata.ts"),
      path.resolve(outputDir, "./query-abstractions/index.ts"),
      path.resolve(outputDir, "./index.ts"),
    ];

    console.log("🔍 Verifying generated files...");
    const missingFiles = expectedFiles.filter((file) => !fs.existsSync(file));

    if (missingFiles.length > 0) {
      throw new Error(`Missing expected files: ${missingFiles.join(", ")}`);
    }

    console.log("🎉 All files generated successfully!");
    console.log(`📁 Generated files location: ${outputDir}`);
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

const program = new Command();

program
  .name("swagger-ts")
  .description("Generate TypeScript API client from Swagger documentation")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate API client from Swagger")
  .requiredOption(
    "--swagger-url <url>",
    "URL to the Swagger JSON documentation",
  )
  .requiredOption("--output <path>", "Output directory for generated files")
  .action(async (options: CLIOptions) => {
    await generateAll(options);
  });

program.parse(process.argv);
