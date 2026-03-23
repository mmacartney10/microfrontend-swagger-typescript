import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import inquirer from "inquirer";
import { Ora } from "ora";

import { DiffResult } from "../types.js";
import chalk from "chalk";

async function fetchSwagger(swaggerUrl: string): Promise<any> {
  console.log(chalk.yellow(`\nFetching Swagger docs from ${swaggerUrl}\n`));

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(swaggerUrl, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Swagger: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

function compareObjects(baseline: any, current: any, path = ""): DiffResult {
  const diff: DiffResult = {
    added: [],
    removed: [],
    modified: [],
    hasChanges: false,
  };

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

  return {
    ...diff,
    hasChanges:
      diff.added.length > 0 ||
      diff.removed.length > 0 ||
      diff.modified.length > 0,
  };
}

async function promptUserAcceptChanges(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "acceptChanges",
      message: "Do you want to proceed with these changes?",
      default: false,
    },
  ]);

  return answer.acceptChanges;
}

function handleFirstRun(
  swaggerPath: string,
  swaggerData: any,
  outputDir: string,
): boolean {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(swaggerPath)) {
    return false;
  }

  fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
  console.log(`Generated ${chalk.cyan("swagger.json")}\n`);

  return true;
}

const logFileChanges = (changeList: string[]) => {
  if (changeList.length > 0) {
    console.log("Added paths:");
    changeList.forEach((path) => console.log(`   + ${chalk.cyan(path)}`));
  }
};

const handleChangesToSwagger = (diff: DiffResult) => {
  console.log(chalk.yellow("Swagger changes detected:\n"));

  logFileChanges(diff.added);
  logFileChanges(diff.removed);
  logFileChanges(diff.modified);

  console.log(
    `\nSummary: ${diff.added.length} added, ${diff.removed.length} removed, ${diff.modified.length} modified\n`,
  );
};

async function validateSwagger(
  outputDir: string,
  swaggerUrl: string,
  spinner: Ora,
): Promise<void> {
  const swaggerPath = path.resolve(outputDir, "./swagger.json");

  try {
    const fetchedSwagger = await fetchSwagger(swaggerUrl);
    const isFirstRun = handleFirstRun(swaggerPath, fetchedSwagger, outputDir);

    if (isFirstRun) {
      return;
    }

    const existingSwagger = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
    const diff = compareObjects(existingSwagger, fetchedSwagger);

    if (!diff.hasChanges) {
      console.log(chalk.green("No changes detected in Swagger spec.\n"));
      return;
    }

    handleChangesToSwagger(diff);

    spinner.stop();

    const accepted = await promptUserAcceptChanges();

    spinner.start();

    if (accepted) {
      fs.writeFileSync(swaggerPath, JSON.stringify(fetchedSwagger, null, 2));
      console.log(chalk.green("\n✅ swagger.json updated."));
      console.log(chalk.cyan("✨ Proceeding with generation...\n"));
    } else {
      console.log(
        chalk.red("\n⏹️  Generation cancelled. swagger.json not updated."),
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during Swagger validation:", error);
    process.exit(1);
  }
}

export { validateSwagger };
