import "dotenv/config";
import * as path from "node:path";
import * as fs from "node:fs";
import { spawn, ChildProcess } from "node:child_process";
import { promisify } from "node:util";

const wait = promisify(setTimeout);

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
function runScript(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child: ChildProcess = spawn(
      "ts-node",
      ["--compiler-options", '{"module":"commonjs"}', scriptPath],
      {
        stdio: "inherit",
        cwd: process.cwd(),
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

async function generateAll() {
  const outputDir = path.resolve(process.cwd(), "./output");
  const apiFilePath = path.resolve(outputDir, "./Api.ts");
  const metadataFilePath = path.resolve(outputDir, "./services-metadata.ts");

  try {
    console.log("🚀 Starting API and hooks generation...");

    // Step 0: Validate Swagger changes
    console.log("🔍 Validating Swagger changes...");
    await runScript("./src/validate-swagger.ts");
    console.log("✅ Swagger validation completed");

    // Step 1: Run generate-api.ts
    console.log("📡 Generating API from Swagger...");
    await runScript("./src/generate-api.ts");
    console.log("✅ API generation completed");

    // Step 2: Wait for output files to be created
    console.log("⏳ Waiting for output files...");
    await waitForFiles([apiFilePath, metadataFilePath]);
    console.log("✅ Output files detected");

    // Small delay to ensure files are fully written
    await wait(500);

    // // Step 3: Run generate-hooks.ts
    console.log("🎣 Generating React Query hooks...");
    await runScript("./src/generate-hooks.ts");
    console.log("✅ Hooks generation completed");

    // Step 4: Generate main index.ts in output folder
    console.log("📝 Generating main index.ts...");
    const mainIndexContent = `// Auto-generated exports

    // Export everything from the generated API
    export * from "./Api";

    // Export all React Query hooks
    export * from "./hooks";
    `;
    fs.writeFileSync(path.resolve(outputDir, "index.ts"), mainIndexContent);
    console.log("✅ Main index.ts generated");

    // Step 5: Verify all expected files exist
    const expectedFiles = [
      path.resolve(outputDir, "./Api.ts"),
      path.resolve(outputDir, "./services-metadata.ts"),
      path.resolve(outputDir, "./hooks/index.ts"),
      path.resolve(outputDir, "./index.ts"),
    ];

    console.log("🔍 Verifying generated files...");
    const missingFiles = expectedFiles.filter((file) => !fs.existsSync(file));

    if (missingFiles.length > 0) {
      throw new Error(`Missing expected files: ${missingFiles.join(", ")}`);
    }

    console.log("🎉 All files generated successfully!");
    console.log("📦 Ready for build process");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log("\n⏹️  Generation interrupted");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n⏹️  Generation terminated");
  process.exit(0);
});

generateAll().catch(console.error);
