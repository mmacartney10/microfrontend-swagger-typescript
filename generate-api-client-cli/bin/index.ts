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

program.action(async () => {
  try {
    log(content.title);

    const { swaggerUrl, outputDir } = await prompt();

    await validateSwagger(outputDir, swaggerUrl).catch(handleError);

    await generateApi(outputDir).catch(handleError);

    await generateQueryAbstractions(outputDir).catch(handleError);

    log(content.completionSuccess);
  } catch (error) {
    handleError(error as Error);
  }
});

program.parse(process.argv);
