import ora from "ora";

import content from "./content.js";
import { generateQueryAbstractions } from "./generate.js";

async function init(outputDir: string): Promise<void> {
  const spinner = ora(content.spinner).start();

  try {
    await generateQueryAbstractions(outputDir);
    spinner.succeed(content.success);
  } catch (error) {
    spinner.fail(content.failure);
    throw error;
  }
}

export default init;
