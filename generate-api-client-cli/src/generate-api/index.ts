import ora from "ora";

import { generateTypeScript } from "./generate.js";
import content from "./content.js";

async function init(outputDir: string): Promise<void> {
  const spinner = ora(content.spinner).start();

  try {
    await generateTypeScript(outputDir);
    spinner.succeed(content.success);
  } catch (error) {
    spinner.fail(content.failure);
    throw new Error(content.failure);
  }
}

export default init;
