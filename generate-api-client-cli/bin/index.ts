#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { validateSwagger } from "../src/utils/validate-swagger.js";
import { generateTypeScript } from "../src/utils/generate-api.js";
import { generateQueryAbstractions } from "../src/utils/generate-query-abstractions.js";

program.version("1.0.0").description("Generate API Client CLI");

interface CliAnswers {
  swaggerUrl: string;
  outputDir: string;
}

program.action(async () => {
  try {
    console.log(chalk.blue.bold("🚀 API Client Generator\n"));

    const answers: CliAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "swaggerUrl",
        message: "Enter the URL of the Swagger documentation:",
        default: process.env.SWAGGER_DOCS_URL || "",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Swagger URL is required";
          }
          try {
            new URL(input);
            return true;
          } catch {
            return "Please enter a valid URL";
          }
        },
      },
      {
        type: "input",
        name: "outputDir",
        message: "Enter the output directory:",
        default: process.env.OUTPUT_DIR || "./output",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Output directory is required";
          }
          return true;
        },
      },
    ]);

    // Set environment variables for the validation function
    process.env.SWAGGER_DOCS_URL = answers.swaggerUrl;
    process.env.OUTPUT_DIR = answers.outputDir;

    console.log(chalk.cyan("\n📋 Configuration:"));
    console.log(chalk.cyan("Swagger URL:"), answers.swaggerUrl);
    console.log(chalk.cyan("Output Directory:"), answers.outputDir);

    // Step 1: Validate Swagger
    const validationSpinner = ora(
      "Validating Swagger specification...",
    ).start();

    try {
      await validateSwagger(answers.swaggerUrl, answers.outputDir);
      validationSpinner.succeed(chalk.green("Swagger validation completed"));
    } catch (error) {
      validationSpinner.fail(chalk.red("Swagger validation failed"));
      throw error;
    }

    // Step 2: Generate API Client
    const generationSpinner = ora(
      "Generating TypeScript API client...",
    ).start();

    try {
      await generateTypeScript(answers.outputDir);
      generationSpinner.succeed(
        chalk.green("API client generated successfully"),
      );
    } catch (error) {
      generationSpinner.fail(chalk.red("API client generation failed"));
      throw error;
    }

    // Step 3: Generate Query Abstractions
    const queryAbstractionsSpinner = ora(
      "Generating TypeScript query abstractions...",
    ).start();

    try {
      await generateQueryAbstractions(answers.outputDir);
      queryAbstractionsSpinner.succeed(
        chalk.green("Query abstractions generated successfully"),
      );
    } catch (error) {
      queryAbstractionsSpinner.fail(
        chalk.red("Query abstractions generation failed"),
      );
      throw error;
    }

    console.log(
      chalk.green.bold("\n🎉 API Client generation completed successfully!"),
    );
    console.log(
      chalk.cyan(`\n📁 Generated files are available in: ${answers.outputDir}`),
    );
  } catch (error) {
    console.error(chalk.red("\n❌ An error occurred:"), error);
    process.exit(1);
  }
});

program.parse(process.argv);
