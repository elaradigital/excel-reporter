import ExcelJS from "exceljs";

export const formatCells = (worksheet: ExcelJS.Worksheet) => {
  worksheet.columns.forEach((column) => {
    // Align Cells to Center
    column.alignment = { horizontal: "center", vertical: "middle" };

    // Set Font
    column.font = { name: "Calibri", family: 2, size: 11 };
  });

  // Set Header Row Bold
  worksheet.getRow(1).font = { bold: true };
};
