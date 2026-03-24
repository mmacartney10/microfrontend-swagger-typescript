#!/usr/bin/env node

import { program } from "commander";

import prompt from "../src/prompt/index.js";
import validateSwagger from "../src/validate-swagger/index.js";
import generateApi from "../src/generate-api/index.js";
import generateQueryAbstractions from "../src/generate-query-abstractions/index.js";
import { defaultContent as content } from "../src/content/index.js";

const log = console.log;

function handleError(error: Error): void {
  console.error(content.error, error);
  process.exit(1);
}

program.version("1.0.0").description("Generate API Client CLI");

program
  .option(
    "--non-interactive",
    "Run without interactive prompts (requires --swagger-url and --output-dir)",
  )
  .option(
    "--swagger-url <url>",
    "Swagger documentation URL (required in non-interactive mode)",
  )
  .option(
    "--output-dir <dir>",
    "Output directory (required in non-interactive mode)",
  )
  .action(async (options) => {
    try {
      log(content.title);

      let swaggerUrl: string;
      let outputDir: string;

      // Determine if we need to prompt for inputs
      const hasSwaggerUrl = !!options.swaggerUrl;
      const hasOutputDir = !!options.outputDir;
      const needsPrompts = !hasSwaggerUrl || !hasOutputDir;

      if (options.nonInteractive) {
        // Non-interactive mode: require all arguments
        if (!options.swaggerUrl || !options.outputDir) {
          console.error(
            "❌ Error: --swagger-url and --output-dir are required in non-interactive mode",
          );
          process.exit(1);
        }

        swaggerUrl = options.swaggerUrl;
        outputDir = options.outputDir;

        log(`🔧 Running in non-interactive mode:`);
        log(`   Swagger URL: ${swaggerUrl}`);
        log(`   Output directory: ${outputDir}`);
      } else if (needsPrompts) {
        // Interactive mode: prompt for missing arguments
        const answers = await prompt();
        swaggerUrl = options.swaggerUrl || answers.swaggerUrl;
        outputDir = options.outputDir || answers.outputDir;
      } else {
        // All arguments provided: use them directly (semi-interactive mode)
        swaggerUrl = options.swaggerUrl;
        outputDir = options.outputDir;

        log(`🔧 Using provided arguments:`);
        log(`   Swagger URL: ${swaggerUrl}`);
        log(`   Output directory: ${outputDir}`);
      }

      await validateSwagger(outputDir, swaggerUrl).catch(handleError);

      await generateApi(outputDir).catch(handleError);

      await generateQueryAbstractions(outputDir).catch(handleError);

      log(content.completionSuccess);
    } catch (error) {
      handleError(error as Error);
    }
  });

program.parse(process.argv);
