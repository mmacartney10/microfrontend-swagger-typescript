import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
}

async function fetchSwagger(swaggerUrl: string): Promise<any> {
  console.log(`📡 Fetching Swagger from ${swaggerUrl}...`);
  const response = await fetch(swaggerUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch Swagger: ${response.statusText}`);
  }
  return response.json();
}

function compareObjects(baseline: any, current: any, path = ""): DiffResult {
  const diff: DiffResult = { added: [], removed: [], modified: [] };

  for (const key in baseline) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in current)) {
      diff.removed.push(currentPath);
    } else if (
      typeof baseline[key] === "object" &&
      typeof current[key] === "object"
    ) {
      if (Array.isArray(baseline[key]) && Array.isArray(current[key])) {
        if (JSON.stringify(baseline[key]) !== JSON.stringify(current[key])) {
          diff.modified.push(currentPath);
        }
      } else {
        const nested = compareObjects(baseline[key], current[key], currentPath);
        diff.added.push(...nested.added);
        diff.removed.push(...nested.removed);
        diff.modified.push(...nested.modified);
      }
    } else if (baseline[key] !== current[key]) {
      diff.modified.push(currentPath);
    }
  }

  for (const key in current) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in baseline)) {
      diff.added.push(currentPath);
    }
  }

  return diff;
}

function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function validateSwagger(
  swaggerUrl?: string,
  outputDir?: string,
): Promise<void> {
  const SWAGGER_URL = swaggerUrl || (process.env.SWAGGER_DOCS_URL as string);
  const OUTPUT_DIR =
    outputDir ||
    process.env.OUTPUT_DIR ||
    path.resolve(process.cwd(), "./output");
  const SWAGGER_PATH = path.resolve(OUTPUT_DIR, "./swagger.json");

  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const fetchedSwagger = await fetchSwagger(SWAGGER_URL);

    if (!fs.existsSync(SWAGGER_PATH)) {
      console.log("\n⚠️  No swagger.json found. This is the first run.");
      fs.writeFileSync(SWAGGER_PATH, JSON.stringify(fetchedSwagger, null, 2));
      console.log(`✅ Created swagger.json at ${SWAGGER_PATH}`);
      console.log("\n✨ Proceeding with generation...\n");
      return;
    }

    const existingSwagger = JSON.parse(fs.readFileSync(SWAGGER_PATH, "utf-8"));

    const diff = compareObjects(existingSwagger, fetchedSwagger);

    const hasChanges =
      diff.added.length > 0 ||
      diff.removed.length > 0 ||
      diff.modified.length > 0;

    if (!hasChanges) {
      console.log("\n✅ No changes detected in Swagger spec.");
      console.log("✨ Proceeding with generation...\n");
      return;
    }

    console.log("\n🔍 Swagger changes detected:\n");

    if (diff.added.length > 0) {
      console.log("✅ Added paths:");
      diff.added.slice(0, 20).forEach((p) => console.log(`   + ${p}`));
      if (diff.added.length > 20) {
        console.log(`   ... and ${diff.added.length - 20} more`);
      }
      console.log();
    }

    if (diff.removed.length > 0) {
      console.log("❌ Removed paths:");
      diff.removed.slice(0, 20).forEach((p) => console.log(`   - ${p}`));
      if (diff.removed.length > 20) {
        console.log(`   ... and ${diff.removed.length - 20} more`);
      }
      console.log();
    }

    if (diff.modified.length > 0) {
      console.log("🔄 Modified paths:");
      diff.modified.slice(0, 20).forEach((p) => console.log(`   ~ ${p}`));
      if (diff.modified.length > 20) {
        console.log(`   ... and ${diff.modified.length - 20} more`);
      }
      console.log();
    }

    console.log(
      `📊 Summary: ${diff.added.length} added, ${diff.removed.length} removed, ${diff.modified.length} modified\n`,
    );

    const answer = await promptUser(
      "Do you want to proceed with these changes? (yes/no): ",
    );

    if (answer === "yes" || answer === "y") {
      fs.writeFileSync(SWAGGER_PATH, JSON.stringify(fetchedSwagger, null, 2));
      console.log("\n✅ swagger.json updated.");
      console.log("✨ Proceeding with generation...\n");
    } else {
      console.log("\n⏹️  Generation cancelled. swagger.json not updated.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during Swagger validation:", error);
    process.exit(1);
  }
}

export { validateSwagger };
