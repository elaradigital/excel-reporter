import { addMinutes, endOfMonth, format, startOfMonth } from "date-fns";
import ExcelJS from "exceljs";

import { fitCellWidthToContent } from "../utils/fit-cell-width";
import { formatCells } from "../utils/format-cells";
import { getWorkOrders } from "../utils/get-work-orders";

export const generateMonthlyReport = async (year: number, month: number) => {
  const startDate = startOfMonth(new Date(`${year}-${month}-01`));
  const endDate = endOfMonth(startDate);

  const fileName = `Monthly Report (${format(startDate, "yyyy-MM")})`;
  const fileExtension = "xlsx";

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName);

  const workOrders = await getWorkOrders({
    startedAt: { gte: startDate, lte: endDate },
  });

  worksheet.columns = [
    { header: "Due Date", key: "dueDate" },
    { header: "Work Order #", key: "number" },
    { header: "Description", key: "title" },
    { header: "Location", key: "location" },
    { header: "Asset", key: "assets" },
    { header: "Actual Start", key: "startedAt" },
    { header: "Actual Finish", key: "endedAt" },
    { header: "Work Duration (mins)", key: "duration" },
    { header: "Work Type", key: "type" },
    { header: "CM Type", key: "cmType" },
    { header: "Failure Code", key: "failureCode" },
    { header: "Frequency", key: "frequency" },
    { header: "Departments", key: "teams" },
    { header: "Status", key: "status" },
    { header: "Manhour (mins)", key: "usersByDuration" },
    { header: "Manpower", key: "users" },
    { header: "Mancount", key: "usersCount" },
  ];

  for (const workOrder of workOrders) {
    const timeReports = workOrder.timeReports;
    const lastTimeReport = timeReports[timeReports.length - 1];

    worksheet.addRow({
      dueDate: workOrder.dueDate,
      number: workOrder.number,
      title: workOrder.title,
      location: workOrder.assets
        .map(({ asset }) => asset.place?.name ?? "-")
        .join(", "),
      assets: workOrder.assets.map((a) => a.asset.name).join(", "),
      startedAt: lastTimeReport.startedAt,
      endedAt: addMinutes(
        lastTimeReport.startedAt,
        lastTimeReport.durationMinutes
      ),
      duration: workOrder.timeReports.reduce((acc, curr) => {
        return acc + curr.durationMinutes;
      }, 0),
      type: workOrder.categories.map((c) => c.name).join(", "),
      cmType: "NULL",
      failureCode: "NULL",
      frequency: (() => {
        const title = workOrder.title.toLowerCase();
        if (title.includes("daily")) return "DAILY";
        if (title.includes("weekly")) return "WEEKLY";
        if (title.includes("quarterly")) return "QUARTERLY";
        if (title.includes("monthly")) return "MONTHLY";
        if (title.includes("half yearly")) return "HALF YEARLY";
        if (title.includes("yearly")) return "YEARLY";
        return "NULL";
      })(),
      teams: workOrder.teams.map((t) => t.team.name).join(", "),
      status: workOrder.status.toUpperCase(),
      usersByDuration: (() => {
        const duration = workOrder.timeReports.reduce((acc, curr) => {
          return acc + curr.durationMinutes;
        }, 0);
        const usersCount = new Set(
          workOrder.timeReports.map((t) => t.user.name)
        ).size;
        return duration / usersCount;
      })(),
      users: workOrder.timeReports.map((t) => t.user.name).join(", "),
      usersCount: new Set(workOrder.timeReports.map((t) => t.user.name)).size,
    });
  }

  formatCells(worksheet);
  fitCellWidthToContent(worksheet);

  await workbook.xlsx.writeFile(`reports/${fileName}.${fileExtension}`);
};
