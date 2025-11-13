import ExcelJS from "exceljs";

/**
 * Converts multiple HTML tables into an Excel file,
 * where each table becomes its own worksheet.
 * Returns the generated File object instead of downloading it.
 */
export async function createExcelForAgentic(
  sourceTables: any[],
  accessionNumber: string
): Promise<File> {
  if (!sourceTables || sourceTables.length === 0) {
    throw new Error("No tables available to convert into Excel.");
  }

  const workbook = new ExcelJS.Workbook();

  // ---------------- Helper functions ----------------

  function findCostRowIndex(rows: HTMLTableRowElement[]): number {
    return rows.findIndex((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      return cells.some((cell) =>
        cell.textContent?.toLowerCase().includes("cost")
      );
    });
  }

  function getMergedCellsInRow(
    row: HTMLTableRowElement
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

  function parseTableWithMergedCells(htmlString: string): {
    data: string[][];
    mergedCellsMap: Map<number, { colspan: number; content: string }>;
  } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr"));

    let startRowIndex = findCostRowIndex(rows);
    if (startRowIndex === -1) startRowIndex = 0;

    const mergedCellsMap = getMergedCellsInRow(rows[startRowIndex]);
    const data: string[][] = [];

    for (let i = startRowIndex; i < rows.length; i++) {
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll("th, td"));
      const rowData: string[] = [];

      cells.forEach((cell) => {
        const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
        const content = cell.textContent?.trim() || "";

        rowData.push(content);
        for (let j = 1; j < colspan; j++) rowData.push("");
      });

      data.push(rowData);
    }

    return { data, mergedCellsMap };
  }

  function concatenateMergedColumns(
    data: string[][],
    mergedCellsMap: Map<number, { colspan: number; content: string }>
  ): string[][] {
    if (mergedCellsMap.size === 0) return data;

    const result: string[][] = [];

    data.forEach((row) => {
      const newRow = [...row];

      mergedCellsMap.forEach((mergeInfo, startCol) => {
        const { colspan } = mergeInfo;
        const endCol = startCol + colspan;

        const valuesToConcat: string[] = [];
        for (let col = startCol; col < endCol && col < newRow.length; col++) {
          if (newRow[col]) valuesToConcat.push(newRow[col]);
        }

        if (valuesToConcat.length > 0) {
          newRow[startCol] = valuesToConcat.join(" ");
        }

        for (let col = startCol + 1; col < endCol && col < newRow.length; col++) {
          newRow[col] = "";
        }
      });

      result.push(newRow);
    });

    return result;
  }

  // ---------------- Core Logic ----------------

  for (let i = 0; i < sourceTables.length; i++) {
    const htmlString = sourceTables[i].Table_HTML;

    // Create a new worksheet for each table
    const worksheet = workbook.addWorksheet(`Table ${i + 1}`);

    const { data, mergedCellsMap } = parseTableWithMergedCells(htmlString);
    const processedData = concatenateMergedColumns(data, mergedCellsMap);

    processedData.forEach((rowData) => worksheet.addRow(rowData));

    // Auto-size columns for this worksheet
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

  // ---------------- Return as File ----------------

  const buffer = await workbook.xlsx.writeBuffer();
  return new File([buffer], `${accessionNumber}_agentic_multisheet.xlsx`, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
