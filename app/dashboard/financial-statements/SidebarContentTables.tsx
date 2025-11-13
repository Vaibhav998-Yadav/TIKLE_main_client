"use client";

import React, { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import styles from "./sec_table_styles.module.css";
import { BASE_URL } from "@/app/services/api/apiConfig";

interface Props {
  activeItem: string;
  filingData: {
    accessionNumber: string;
    primaryDocument: string;
  } | null;
  statementsLoading: boolean;
  groupedReports?: Record<string, any[]> | null;
}

export default function SidebarContentTables({
  activeItem,
  filingData,
  statementsLoading,
  groupedReports,
}: Props) {
  const [tables, setTables] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingHtml, setLoadingHtml] = useState(false);

  const selectedReport = useMemo(() => {
    if (!groupedReports) return null;
    for (const [_, reports] of Object.entries(groupedReports)) {
      const match = reports.find(
        (r) =>
          r.shortName?.trim().toLowerCase() === activeItem?.trim().toLowerCase()
      );
      if (match) return match;
    }
    return null;
  }, [groupedReports, activeItem]);

const reportUrl = useMemo(() => {
  if (!selectedReport || !filingData?.accessionNumber) return null;

  // ✅ Use the CIK from filingData or extract from instance if needed
  let cik = filingData?.accessionNumber.split("-")[0]; // fallback pattern
  const accessionClean = filingData.accessionNumber.replace(/-/g, "");

  // Try to extract from instance (for other filings)
  if (selectedReport.instance) {
    const match = selectedReport.instance.match(/ck(\d+)-/);
    if (match) cik = match[1];
  }

  // ✅ If still missing, fallback to primaryDocument CIK path (safer)
  if (!cik && filingData.primaryDocument) {
    const pathMatch = filingData.primaryDocument.match(/data\/(\d+)\//);
    if (pathMatch) cik = pathMatch[1];
  }

  if (!cik) return null;

  return `https://www.sec.gov/Archives/edgar/data/${parseInt(
    cik
  )}/${accessionClean}/${selectedReport.htmlFileName}`;
}, [selectedReport, filingData]);


  // ✅ Fetch & Parse Filing HTML
  useEffect(() => {
    if (!reportUrl) return;
    setLoadingHtml(true);
    setTables([]);
    setCurrentPage(0);

    fetch(`${BASE_URL}fetch-filing-html?url=${reportUrl}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const text = await res.text();

        // Parse out all <table> elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const foundTables = Array.from(doc.querySelectorAll("table")).map(
          (t) => t.outerHTML
        );

        // If no tables, fallback to entire content
        if (foundTables.length === 0) {
          setTables([text]);
        } else {
          setTables(foundTables);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load SEC HTML:", err);
        setTables([
          "<p class='text-red-600'>Failed to load filing content.</p>",
        ]);
      })
      .finally(() => setLoadingHtml(false));
  }, [reportUrl]);

  // ✅ Excel Download Logic
  const handleDownloadExcel = async (allTables: boolean) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("SEC Filing");

      const exportTables = allTables ? tables : [tables[currentPage]];
      if (!exportTables.length) {
        alert("No tables found to export.");
        return;
      }

      exportTables.forEach((tableHTML, tIndex) => {
        const container = document.createElement("div");
        container.innerHTML = tableHTML;
        const rows = Array.from(container.querySelectorAll("tr"));
        if (tIndex > 0) sheet.addRow([]); // space between tables

        rows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll("th, td"));
          const values = cells.map((c) => c.textContent?.trim() || "");
          sheet.addRow(values);
        });
      });

      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = allTables
        ? `${activeItem.replace(/\s+/g, "_")}_all_tables.xlsx`
        : `${activeItem.replace(/\s+/g, "_")}_table_${currentPage + 1}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("❌ Excel Export Failed:", err);
      alert("Failed to export Excel. Check console for details.");
    }
  };

  // ✅ Pagination Controls
  const totalPages = tables.length;
  const canPaginate = totalPages > 1;

  // ====== Rendering ======
  if (statementsLoading) {
    return <p className="text-muted-foreground animate-pulse">Fetching statements...</p>;
  }

  if (!groupedReports) {
    return <p className="text-muted-foreground">No filing loaded yet.</p>;
  }

  if (!selectedReport) {
    return <p className="text-muted-foreground">Select a report from the sidebar.</p>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-250px)]">
      {/* ===== Header Section ===== */}
      <div className="text-sm text-muted-foreground mb-2 flex justify-between items-center">
        <div className="flex items-center gap-4 ml-2">
          <a
            href={reportUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline whitespace-nowrap"
          >
            View on SEC.gov ↗
          </a>

          <button
            onClick={() => handleDownloadExcel(false)}
            className="bg-[#435f97] hover:bg-[#384e7d] text-white text-xs px-3 py-1.5 rounded-md shadow-sm transition-all"
          >
            Download Current
          </button>

          {totalPages > 1 && (
            <button
              onClick={() => handleDownloadExcel(true)}
              className="bg-[#6787d3] hover:bg-[#506db1] text-white text-xs px-3 py-1.5 rounded-md shadow-sm transition-all"
            >
              Download All
            </button>
          )}
        </div>
      </div>

      {/* ===== Content Section ===== */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden border border-border bg-white rounded-lg shadow-sm">
        {loadingHtml ? (
          <p className="text-muted-foreground animate-pulse p-4">Loading report HTML...</p>
        ) : (
          <div
            className={`${styles["sec-html-content"]} prose max-w-none p-4 text-sm leading-relaxed`}
            dangerouslySetInnerHTML={{
              __html: tables[currentPage] || "<p>No content loaded.</p>",
            }}
          />
        )}
      </div>

      {/* ===== Pagination Controls ===== */}
      {canPaginate && (
        <div className="flex justify-center items-center gap-3 p-3 text-xs text-muted-foreground">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
            className="px-2 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-40"
          >
            ← Prev
          </button>

          <span>
            Table {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="px-2 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
