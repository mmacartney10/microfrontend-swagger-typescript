import chalk from "chalk";

export const defaultContent = {
  messages: {
    title: chalk.blue.bold("🚀 API Client Generator\n"),
    completionSuccess: chalk.green(
      "🎉 API Client generation completed successfully!",
    ),
    error: chalk.red("\n❌ An error occurred:"),
  },
};
