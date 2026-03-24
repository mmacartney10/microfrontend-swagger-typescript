import chalk from "chalk";

export const defaultContent = {
  title: chalk.blue.bold("🚀 API Client Generator\n"),
  completionSuccess: chalk.green(
    "🎉 API Client generation completed successfully!\n",
  ),
  error: chalk.red("\n❌ An error occurred:"),
};
