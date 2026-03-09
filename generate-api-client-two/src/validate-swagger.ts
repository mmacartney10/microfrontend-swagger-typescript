import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

const SWAGGER_URL = process.env.SWAGGER_DOCS_URL as string;
const BASELINE_PATH = path.resolve(process.cwd(), "./swagger-baseline.json");
const CURRENT_PATH = path.resolve(process.cwd(), "./swagger.json");

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
}

async function fetchSwagger(): Promise<any> {
  console.log(`📡 Fetching Swagger from ${SWAGGER_URL}...`);
  const response = await fetch(SWAGGER_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Swagger: ${response.statusText}`);
  }
  return response.json();
}

function compareObjects(baseline: any, current: any, path = ""): DiffResult {
  const diff: DiffResult = { added: [], removed: [], modified: [] };

  // Find removed and modified
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

  // Find added
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

async function validateSwagger(): Promise<void> {
  try {
    // Fetch current swagger
    const currentSwagger = await fetchSwagger();

    // Save current swagger
    fs.writeFileSync(CURRENT_PATH, JSON.stringify(currentSwagger, null, 2));
    console.log(`✅ Saved current Swagger to ${CURRENT_PATH}`);

    // Check if baseline exists
    if (!fs.existsSync(BASELINE_PATH)) {
      console.log("\n⚠️  No baseline found. This is the first run.");
      fs.writeFileSync(BASELINE_PATH, JSON.stringify(currentSwagger, null, 2));
      console.log(`✅ Created baseline at ${BASELINE_PATH}`);
      console.log("\n✨ Proceeding with generation...\n");
      return;
    }

    // Load baseline
    const baselineSwagger = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));

    // Compare
    const diff = compareObjects(baselineSwagger, currentSwagger);

    // Check if there are changes
    const hasChanges =
      diff.added.length > 0 ||
      diff.removed.length > 0 ||
      diff.modified.length > 0;

    if (!hasChanges) {
      console.log("\n✅ No changes detected in Swagger spec.");
      console.log("✨ Proceeding with generation...\n");
      return;
    }

    // Display changes
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

    // Prompt for confirmation
    const answer = await promptUser(
      "Do you want to proceed with these changes? (yes/no): ",
    );

    if (answer === "yes" || answer === "y") {
      // Update baseline
      fs.writeFileSync(BASELINE_PATH, JSON.stringify(currentSwagger, null, 2));
      console.log("\n✅ Baseline updated.");
      console.log("✨ Proceeding with generation...\n");
    } else {
      console.log("\n⏹️  Generation cancelled. Baseline not updated.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error validating Swagger:", error);
    process.exit(1);
  }
}

validateSwagger();
