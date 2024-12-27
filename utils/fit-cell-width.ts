import ExcelJS from "exceljs";

export const fitCellWidthToContent = (worksheet: ExcelJS.Worksheet) => {
  for (let i = 0; i < worksheet.columns.length; i += 1) {
    let maxLength = 0;

    const column = worksheet.columns[i];
    const values = column.values ?? [];

    for (let j = 1; j < values.length; j += 1) {
      if (!values[j]) continue;

      const columnLength = (values[j] as string).length;
      if (columnLength > maxLength) maxLength = columnLength;
    }

    column.width = maxLength < 12 ? 12 : maxLength;
  }
};
