import ora from "ora";

import content from "./content.js";
import { validateSwagger } from "./generate.js";

async function init(outputDir: string, swaggerUrl: string): Promise<void> {
  const spinner = ora(content.spinner).start();

  try {
    await validateSwagger(outputDir, swaggerUrl, spinner);
    spinner.succeed(content.success);
  } catch (error) {
    spinner.fail(content.failure);
    throw error;
  }
}

export default init;
