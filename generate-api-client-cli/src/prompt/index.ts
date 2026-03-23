import inquirer from "inquirer";
import { CliAnswers } from "../types.js";

function validateSwaggerUrl(url: string): string | boolean {
  if (!url.trim()) {
    return "Swagger URL is required";
  }

  try {
    new URL(url);
    return true;
  } catch {
    return "Please enter a valid URL";
  }
}

function validateOutputDir(dir: string): string | boolean {
  if (!dir.trim()) {
    return "Output directory is required";
  }
  return true;
}

async function init(): Promise<CliAnswers> {
  const answers = (await inquirer.prompt([
    {
      type: "input",
      name: "swaggerUrl",
      message: "Enter the URL of the Swagger documentation:",
      default: process.env.SWAGGER_DOCS_URL || "",
      validate: validateSwaggerUrl,
    },
    {
      type: "input",
      name: "outputDir",
      message: "Enter the output directory:",
      default: process.env.OUTPUT_DIR || "./output",
      validate: validateOutputDir,
    },
  ])) as CliAnswers;

  if (!answers) {
    throw new Error("Failed to get user input");
  }

  return answers;
}

export default init;
