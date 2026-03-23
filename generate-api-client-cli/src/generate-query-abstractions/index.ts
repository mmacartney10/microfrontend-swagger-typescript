import ora from "ora";

import content from "./content.js";
import { generateQueryAbstractions } from "./generate.js";

async function init(outputDir: string): Promise<void> {
  const queryAbstractionsSpinner = ora(content.spinner).start();

  try {
    await generateQueryAbstractions(outputDir);
    queryAbstractionsSpinner.succeed(content.success);
  } catch (error) {
    queryAbstractionsSpinner.fail(content.failure);
    throw error;
  }
}

export default init;
