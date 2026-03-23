import chalk from "chalk";

export default {
  generateApi: `Generated ${chalk.cyan("api.ts")}`,
  generateServicesMetadata: `Generated ${chalk.cyan("services-metadata.ts")}\n`,
  spinner: "Generating TypeScript API client...",
  success: chalk.green("API client generated successfully\n"),
  failure: chalk.red("API client generation failed"),
};
