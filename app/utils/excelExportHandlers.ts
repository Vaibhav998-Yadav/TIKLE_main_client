import ExcelJS from "exceljs";
import { requestExcelUpload } from "@/app/services/api/export_soi_in_excel";

/**
 * Finds the first row containing "cost" (case-insensitive) and returns its index
 */
function findCostRowIndex(rows: HTMLTableRowElement[]): number {
  return rows.findIndex((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    return cells.some((cell) =>
      cell.textContent?.toLowerCase().includes("cost")
    );
  });
}

/**
 * Extracts merged cell information from a specific row
 */
function getMergedCellsInRow(
  row: HTMLTableRowElement,
  rowIndex: number
): Map<number, { colspan: number; content: string }> {
  const mergedCells = new Map<number, { colspan: number; content: string }>();
  const cells = Array.from(row.querySelectorAll("th, td"));
  let currentColIndex = 0;

  cells.forEach((cell) => {
    const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
    const content = cell.textContent?.trim() || "";

    if (colspan > 1) {
      mergedCells.set(currentColIndex, { colspan, content });
    }

    currentColIndex += colspan;
  });

  return mergedCells;
}

/**
 * Converts HTML table to array format, handling merged cells
 */
function parseTableWithMergedCells(
  htmlString: string,
  startFromCostRow: boolean = true
): { data: string[][]; mergedCellsMap: Map<number, { colspan: number; content: string }> } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rows = Array.from(doc.querySelectorAll("tr"));

  let startRowIndex = 0;
  let mergedCellsMap = new Map<number, { colspan: number; content: string }>();

  if (startFromCostRow) {
    startRowIndex = findCostRowIndex(rows);
    if (startRowIndex === -1) {
      startRowIndex = 0; // If "cost" not found, start from beginning
    } else {
      // Get merged cells from the cost row
      mergedCellsMap = getMergedCellsInRow(rows[startRowIndex], startRowIndex);
    }
  }

  const data: string[][] = [];
  
  // Process rows starting from the cost row
  for (let i = startRowIndex; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.querySelectorAll("th, td"));
    const rowData: string[] = [];
    
    cells.forEach((cell) => {
      const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
      const content = cell.textContent?.trim() || "";
      
      // Add the cell content
      rowData.push(content);
      
      // Add empty cells for colspan > 1 (unmerging)
      for (let j = 1; j < colspan; j++) {
        rowData.push("");
      }
    });
    
    data.push(rowData);
  }

  return { data, mergedCellsMap };
}

/**
 * Concatenates values from columns that were originally merged
 */
function concatenateMergedColumns(
  data: string[][],
  mergedCellsMap: Map<number, { colspan: number; content: string }>
): string[][] {
  if (mergedCellsMap.size === 0) return data;

  const result: string[][] = [];

  data.forEach((row, rowIdx) => {
    const newRow = [...row];

    // For each merged cell range, concatenate the values
    mergedCellsMap.forEach((mergeInfo, startCol) => {
      const { colspan } = mergeInfo;
      const endCol = startCol + colspan;

      // Collect values from all columns in the merged range
      const valuesToConcat: string[] = [];
      for (let col = startCol; col < endCol && col < newRow.length; col++) {
        if (newRow[col]) {
          valuesToConcat.push(newRow[col]);
        }
      }

      // Concatenate and place in the first column
      if (valuesToConcat.length > 0) {
        newRow[startCol] = valuesToConcat.join(" ");
      }

      // Clear the other columns in the merged range
      for (let col = startCol + 1; col < endCol && col < newRow.length; col++) {
        newRow[col] = "";
      }
    });

    result.push(newRow);
  });

  return result;
}

/**
 * Converts HTML table strings into an Excel worksheet (single sheet)
 */
export async function downloadExcelSingleSheet(
  sourceTables: any[],
  accessionNumber: string,
  setStatementsLoading: (loading: boolean) => void
) {
  if (!sourceTables) {
    alert("No tables available to download.");
    return;
  }

  try {
    setStatementsLoading(true);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule of Investments");
    let currentRow = 1;

    for (let i = 0; i < sourceTables.length; i++) {
      const htmlString = sourceTables[i].Table_HTML;

      if (i > 0) {
        worksheet.addRow([]);
        // worksheet.addRow([`Table ${i + 1}`]);
        worksheet.lastRow!.font = { bold: true, color: { argb: "FF1E88E5" } };
        // worksheet.addRow([]);
        currentRow += 3;
      }

      // Parse table with merged cell handling
      const { data, mergedCellsMap } = parseTableWithMergedCells(htmlString, true);
      
      // Concatenate columns that were merged
      const processedData = concatenateMergedColumns(data, mergedCellsMap);

      // Add rows to worksheet
      processedData.forEach((rowData) => {
        worksheet.addRow(rowData);
        currentRow++;
      });
    }

    // Auto-size columns
    worksheet.columns.forEach((col) => {
      if (!col) return;
      let maxLength = 10;
      col.eachCell?.({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
        const len = cell.value ? cell.value.toString().length : 0;
        if (len > maxLength) maxLength = len;
      });
      col.width = maxLength + 3;
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new File([buffer], `${accessionNumber}.xlsx`, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await requestExcelUpload(file, accessionNumber);
  } catch (err) {
    console.error("❌ Error exporting tables:", err);
    alert("Failed to export tables to Excel.");
  } finally {
    setStatementsLoading(false);
  }
}

/**
 * Converts HTML table strings into multiple Excel worksheets
 */
export async function downloadExcelMultiSheet(
  sourceTables: any[],
  accessionNumber: string,
  setStatementsLoading: (loading: boolean) => void
) {
  if (!sourceTables) {
    alert("No tables available to download.");
    return;
  }

  try {
    setStatementsLoading(true);
    const workbook = new ExcelJS.Workbook();

    for (let i = 0; i < sourceTables.length; i++) {
      const htmlString = sourceTables[i].Table_HTML;
      const sheetName = `Table_${i + 1}`;
      const worksheet = workbook.addWorksheet(sheetName);

      // Parse table with merged cell handling
      const { data, mergedCellsMap } = parseTableWithMergedCells(htmlString, true);
      
      // Concatenate columns that were merged
      const processedData = concatenateMergedColumns(data, mergedCellsMap);

      // Add rows to worksheet
      processedData.forEach((rowData) => {
        worksheet.addRow(rowData);
      });

      // Auto-size columns
      worksheet.columns.forEach((col) => {
        if (!col) return;
        let maxLength = 10;
        col.eachCell?.({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
          const len = cell.value ? cell.value.toString().length : 0;
          if (len > maxLength) maxLength = len;
        });
        col.width = maxLength + 3;
      });

      worksheet.views = [{ state: "frozen", ySplit: 1 }];
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new File([buffer], `${accessionNumber}_multisheet.xlsx`, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await requestExcelUpload(file, accessionNumber + "_multisheet");
  } catch (err) {
    console.error("❌ Error exporting multi-sheet Excel:", err);
    alert("Failed to export multi-sheet Excel.");
  } finally {
    setStatementsLoading(false);
  }
}