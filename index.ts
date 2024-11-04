import { AxiosError } from "axios";
import { getWeek } from "date-fns";
import inquirer from "inquirer";

import { generateDailyCompletionReport } from "./scripts/daily-completion-report";
import { generateDailyJobPlanReport } from "./scripts/daily-job-plan-report";
import { generateMonthlyReport } from "./scripts/monthly-report";
import { generateWeeklyReport } from "./scripts/weekly-report";

try {
  const { reportType } = await inquirer.prompt([
    {
      type: "select",
      name: "reportType",
      message: "Select the type of report you want to generate",
      choices: [
        "Daily Completion Report",
        "Daily Job Plan",
        "Monthly Report",
        "Weekly Report",
      ] as const,
    },
  ]);

  if (reportType === "Daily Completion Report") {
    const { date, month, year } = await inquirer.prompt([
      {
        type: "number",
        name: "date",
        message: "Enter the date (1-31):",
        step: 1,
        min: 1,
        max: 31,
        default: new Date().getDate(),
      },
      {
        type: "number",
        name: "month",
        message: "Enter the month (1-12):",
        step: 1,
        min: 1,
        max: 12,
        default: new Date().getMonth() + 1,
      },
      {
        type: "number",
        name: "year",
        message: "Enter the year (YYYY):",
        step: 1,
        min: 1900,
        max: 2100,
        default: new Date().getFullYear(),
      },
    ]);

    await generateDailyCompletionReport(year, month, date);
  }

  if (reportType === "Daily Job Plan") {
    const { date, month, year } = await inquirer.prompt([
      {
        type: "number",
        name: "date",
        message: "Enter the date (1-31):",
        step: 1,
        min: 1,
        max: 31,
        default: new Date().getDate(),
      },
      {
        type: "number",
        name: "month",
        message: "Enter the month (1-12):",
        step: 1,
        min: 1,
        max: 12,
        default: new Date().getMonth() + 1,
      },
      {
        type: "number",
        name: "year",
        message: "Enter the year (YYYY):",
        step: 1,
        min: 1900,
        max: 2100,
        default: new Date().getFullYear(),
      },
    ]);

    await generateDailyJobPlanReport(year, month, date);
  }

  if (reportType === "Monthly Report") {
    const { month, year } = await inquirer.prompt([
      {
        type: "number",
        name: "month",
        message: "Enter the month (1-12):",
        step: 1,
        min: 1,
        max: 12,
        default: new Date().getMonth() + 1,
      },
      {
        type: "number",
        name: "year",
        message: "Enter the year (YYYY):",
        step: 1,
        min: 1900,
        max: 2100,
        default: new Date().getFullYear(),
      },
    ]);

    await generateMonthlyReport(year, month);
  }

  if (reportType === "Weekly Report") {
    const { week, year } = await inquirer.prompt([
      {
        type: "number",
        name: "week",
        message: "Enter the week number (1-53):",
        step: 1,
        min: 1,
        max: 53,
        default: getWeek(new Date()),
      },
      {
        type: "number",
        name: "year",
        message: "Enter the year (YYYY):",
        step: 1,
        min: 1900,
        max: 2100,
        default: new Date().getFullYear(),
      },
    ]);

    await generateWeeklyReport(week, year);
  }

  console.log("✅ Report generated successfully!");
} catch (error) {
  if (error instanceof AxiosError) {
    console.error(
      `❌ The server returned an error:\n${error.response?.data["error"]["message"]}`
    );
    process.exit(1);
  }

  console.error(`❌ An unknown error occurred: ${error}`);
  process.exit(1);
}
