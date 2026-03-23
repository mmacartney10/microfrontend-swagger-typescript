import ora from "ora";

import { generateTypeScript } from "./generate.js";
import content from "./content.js";

async function init(outputDir: string): Promise<void> {
  const generationSpinner = ora(content.spinner).start();

  try {
    await generateTypeScript(outputDir);
    generationSpinner.succeed(content.success);
  } catch (error) {
    generationSpinner.fail(content.failure);
    throw new Error(content.failure);
  }
}

export default init;
