"use client";

import * as XLSX from "xlsx";

/**
 * Main function to fetch SEC filing HTML and export all relevant tables to Excel.
 */

interface TableResponse {
  Table_Index: number;
  Table_HTML: string;
}

/**
 * Fetches table HTMLs from backend and exports to Excel.
 */
export const exportTablesToExcel = async (secDocUrl: string, useSingleSheet: boolean = false) => {
  try {
    const apiUrl = `http://13.201.129.153:8000/get-all-tables?url=${encodeURIComponent(secDocUrl)}&bdc_name=data`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "luv.ratan@decipherfinancials.com",
        "Accept": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const data: { tables: TableResponse[] } = await response.json();

    if (!Array.isArray(data.tables) || data.tables.length === 0)
      throw new Error("No tables found in response");

    const tablesArray: string[] = data.tables.map((table) => table.Table_HTML);

    // ⚙️ Choose workbook creation method
    const workbook = useSingleSheet
      ? singleSheetStatement(tablesArray)
      : multiSheetStatement(tablesArray);

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statements.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err: any) {
    console.error("Error exporting tables to Excel:", err);
    alert("Export failed: " + err.message);
  }
};


/**
 * Converts multiple HTML table strings into an Excel workbook with merged cells.
 */
export const multiSheetStatement = (tablesArray: string[]) => {
  const workbook = XLSX.utils.book_new();

  for (let index = 0; index < tablesArray.length; index++) {
    const tableString = tablesArray[index];

    const doc = new DOMParser().parseFromString(tableString, "text/html");
    const tableElement = doc.querySelector("table");
    if (!tableElement) continue;

    const rows = tableElement.querySelectorAll("tr");
    let startRowIndex = 0;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const text = rows[rowIndex].textContent?.toLowerCase() ?? "";
      if (text.includes("cost")) {
        startRowIndex = rowIndex;
        break;
      }
    }

    const filteredRows = Array.from(rows).slice(startRowIndex);

    // Create new table and safely append cloned rows
    const filteredTable = document.createElement("table");
    filteredRows.forEach((row) => {
      if (row) {
        filteredTable.appendChild(row.cloneNode(true));
      }
    });

    // Convert the table to a worksheet
    const worksheet = htmlTableToSheetWithMerges(filteredTable);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${index + 1}`);
  }

  return workbook;
};

/**
 * Converts a DOM table element into an XLSX worksheet with merged cells.
 */
function htmlTableToSheetWithMerges(tableElement: HTMLTableElement): XLSX.WorkSheet {
  const sheetData: any[][] = [];
  const merges: XLSX.Range[] = [];
  const rows = tableElement.querySelectorAll("tr");

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const cells = row.querySelectorAll("td, th");
    let colIndex = 0;
    sheetData[r] = sheetData[r] || [];

    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c];
      while (sheetData[r][colIndex] !== undefined) colIndex++;

      const cellValue = cell.textContent?.trim() ?? "";
      const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
      const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);

      sheetData[r][colIndex] = cellValue;

      for (let rr = 0; rr < rowspan; rr++) {
        for (let cc = 0; cc < colspan; cc++) {
          if (rr === 0 && cc === 0) continue;
          const targetRow = r + rr;
          const targetCol = colIndex + cc;
          sheetData[targetRow] = sheetData[targetRow] || [];
          sheetData[targetRow][targetCol] = undefined;
        }
      }

      if (rowspan > 1 || colspan > 1) {
        merges.push({
          s: { r, c: colIndex },
          e: { r: r + rowspan - 1, c: colIndex + colspan - 1 },
        });
      }

      colIndex += colspan;
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!merges"] = merges;
  return worksheet;
}


/**
 * Converts multiple HTML tables into a single Excel worksheet stacked vertically.
 */
export const singleSheetStatement = (tablesArray: string[]) => {
  const sheetData: any[][] = [];
  const merges: XLSX.Range[] = [];
  let currentRow = 0;

  for (let index = 0; index < tablesArray.length; index++) {
    const tableString = tablesArray[index];

    const doc = new DOMParser().parseFromString(tableString, "text/html");
    const tableElement = doc.querySelector("table");
    if (!tableElement) continue;

    const rows = tableElement.querySelectorAll("tr");
    let startRowIndex = 0;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const text = rows[rowIndex].textContent?.toLowerCase() ?? "";
      if (text.includes("cost")) {
        startRowIndex = rowIndex;
        break;
      }
    }

    const filteredRows = Array.from(rows).slice(startRowIndex);

    for (let r = 0; r < filteredRows.length; r++) {
      const row = filteredRows[r];
      const cells = row.querySelectorAll("td, th");
      let colIndex = 0;
      sheetData[currentRow] = sheetData[currentRow] || [];

      for (let c = 0; c < cells.length; c++) {
        const cell = cells[c];
        while (sheetData[currentRow][colIndex] !== undefined) colIndex++;

        const cellValue = cell.textContent?.trim() ?? "";
        const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
        const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);

        sheetData[currentRow][colIndex] = cellValue;

        for (let rr = 0; rr < rowspan; rr++) {
          for (let cc = 0; cc < colspan; cc++) {
            if (rr === 0 && cc === 0) continue;
            const targetRow = currentRow + rr;
            const targetCol = colIndex + cc;
            sheetData[targetRow] = sheetData[targetRow] || [];
            sheetData[targetRow][targetCol] = undefined;
          }
        }

        if (rowspan > 1 || colspan > 1) {
          merges.push({
            s: { r: currentRow, c: colIndex },
            e: { r: currentRow + rowspan - 1, c: colIndex + colspan - 1 },
          });
        }

        colIndex += colspan;
      }

      currentRow++;
    }

    // Optional: Add a blank row between tables
    currentRow++;
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!merges"] = merges;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Combined Tables");
  return workbook;
};
