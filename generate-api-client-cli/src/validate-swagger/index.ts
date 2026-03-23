import ora from "ora";

import content from "./content.js";
import { validateSwagger } from "./generate.js";

async function init(outputDir: string, swaggerUrl: string): Promise<void> {
  const validationSpinner = ora(content.spinner).start();

  try {
    await validateSwagger(outputDir, swaggerUrl);
    validationSpinner.succeed(content.success);
  } catch (error) {
    validationSpinner.fail(content.failure);
    throw error;
  }
}

export default init;
