import chalk from "chalk";

export default {
  spinner: "Validating Swagger specification...",
  success: chalk.green("Swagger validation completed successfully\n"),
  failure: chalk.red("Swagger validation failed"),
};
