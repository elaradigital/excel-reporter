import { addMinutes, endOfDay, format, startOfDay } from "date-fns";
import ExcelJS from "exceljs";

import { fitCellWidthToContent } from "../utils/fit-cell-width";
import { formatCells } from "../utils/format-cells";
import { getWorkOrders } from "../utils/get-work-orders";

export const generateDailyCompletionReport = async (
  year: number,
  month: number,
  date: number
) => {
  const startDate = startOfDay(new Date(`${year}-${month}-${date}`));
  const endDate = endOfDay(startDate);

  const fileName = `Daily Completion Report (${format(
    startDate,
    "yyyy-MM-dd"
  )})`;
  const fileExtension = "xlsx";

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName);

  const workOrders = await getWorkOrders({
    dueDate: { gte: startDate, lte: endDate },
    status: { equals: "done" },
  });

  worksheet.columns = [
    { header: "Work Order #", key: "number" },
    { header: "PM Work Description", key: "title" },
    { header: "Department", key: "teams" },
    { header: "Maintenance Type", key: "type" },
    { header: "Location", key: "location" },
    { header: "Actual Start Time (CP)", key: "startedAt" },
    { header: "Actual End Time (CP)", key: "endedAt" },
    { header: "Actual Time Taken (mins)", key: "duration" },
    { header: "Work Done By", key: "users" },
    { header: "Equipment IDs", key: "assets" },
    { header: "Remarks/Summary", key: "status" },
  ];

  for (const workOrder of workOrders) {
    const timeReports = workOrder.timeReports;
    const lastTimeReport = timeReports[timeReports.length - 1];

    worksheet.addRow({
      number: workOrder.number,
      title: workOrder.title,
      teams: workOrder.teams.map((t) => t.team.name).join(", "),
      type: workOrder.categories.map((c) => c.name).join(", "),
      location: workOrder.assets
        .map(({ asset }) => asset.place?.name ?? "-")
        .join(", "),
      startedAt: lastTimeReport.startedAt,
      endedAt: addMinutes(
        lastTimeReport.startedAt,
        lastTimeReport.durationMinutes
      ),
      duration: workOrder.timeReports.reduce((acc, curr) => {
        return acc + curr.durationMinutes;
      }, 0),
      users: workOrder.timeReports.map((t) => t.user.name).join(", "),
      assets: workOrder.assets.map((a) => a.asset.name).join(", "),
      status: workOrder.status.toUpperCase(),
    });
  }

  formatCells(worksheet);
  fitCellWidthToContent(worksheet);

  await workbook.xlsx.writeFile(`reports/${fileName}.${fileExtension}`);
};
