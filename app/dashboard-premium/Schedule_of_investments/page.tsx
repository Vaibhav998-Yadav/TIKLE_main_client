"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import File_selection_form from "./File_selection_form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { requestExcelUpload } from "@/app/services/api/export_soi_in_excel";
import ExcelJS from "exceljs";
import {
  downloadExcelSingleSheet,
  downloadExcelMultiSheet,
} from "@/app/utils/excelExportHandlers";
import { createExcelForAgentic } from "@/app/utils/agenticExcelConverter";
import { requestAgenticSoiRenaming } from "@/app/services/api/agentic_ai_for_soi";
import { sendJsonToBDC } from "@/app/services/api/agentic_approve_to_bdc";

const Agent_main = () => {
  const router = useRouter();

  const [statementsLoading, setStatementsLoading] = useState(false);
  const bdcMeta = useAppSelector((state) => state.bdcMeta);
  const [bdc_name, set_bdc_name] = useState(bdcMeta?.data?.name || "ARCC");

  const [filingData, setFilingData] = useState<{
    accessionNumber: string;
    primaryDocument: string;
  } | null>(null);
  const [groupedReports, setGroupedReports] = useState<Record<
    string,
    any[]
  > | null>(null);
  const [processedTables, setProcessedTables] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Progress / State
  const [progressStep, setProgressStep] = useState(0);
  const [processingStage, setProcessingStage] = useState<number | null>(null);
  const [hasProcessedOnce, setHasProcessedOnce] = useState(false);
  const [showApprovedButton, setShowApprovedButton] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [originalTables, setOriginalTables] = useState<any[] | null>(null);
  const [processedJsonData, setProcessedJsonData] = useState<any[] | null>(
    null
  );

  // Reset state when groupedReports change
  useEffect(() => {
    if (!groupedReports) return;

    // 🧠 Preserve the original unmodified tables (deep copy)
    setOriginalTables(JSON.parse(JSON.stringify(groupedReports.tables)));

    setProcessedTables(null);
    setCurrentPage(0);
    setProgressStep(0);
    setProcessingStage(null);
    setHasProcessedOnce(false);
    setShowApprovedButton(false);
    setIsApproved(false);
    setStatementsLoading(false);
  }, [groupedReports]);

  // 🧩 Simulated processing pipeline
  const handleProcessAndDownload = async () => {
    if (!groupedReports?.tables) {
      alert("No tables to process.");
      return;
    }

    try {
      // 🔄 UI progress indicators
      setIsApproved(false);
      setProgressStep(1);
      setProcessingStage(2);
      setStatementsLoading(true);

      const accessionNumber = filingData?.accessionNumber || "statements";

      // 🧠 STEP 1️⃣: Create Excel and send to backend
      const file = await createExcelForAgentic(
        originalTables || groupedReports.tables,
        accessionNumber
      );

      const responseData = await requestAgenticSoiRenaming(file, bdc_name);
      console.log("✅ Agentic AI unified response:", responseData);
      setProcessedJsonData(responseData);

      // 🧮 STEP 2️⃣: Convert single returned JSON array → one HTML table
      if (Array.isArray(responseData) && responseData.length > 0) {
        const headers = Object.keys(responseData[0]);
        const headerHtml = headers.map((h) => `<th>${h}</th>`).join("");
        const rowsHtml = responseData
          .map((row) => {
            const rowHtml = headers
              .map((h) => `<td>${row[h] ?? ""}</td>`)
              .join("");
            return `<tr>${rowHtml}</tr>`;
          })
          .join("");

        const unifiedTableHtml = `
  <style>
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      color: black;
      font-family: Arial, sans-serif;
      border: none;
    }

    .styled-table thead {
      background-color: #333333;
      color: white;
      text-align: left;
    }

    .styled-table th,
    .styled-table td {
      padding: 2px 12px;
      border-bottom: none;
    }

    /* Alternate row colors */
    .styled-table tbody tr:nth-child(odd) {
      background-color: #ffffff;
    }

    .styled-table tbody tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    /* Optional hover highlight for readability */
    .styled-table tbody tr:hover {
      background-color: #e8e8e8;
    }
  </style>

  <table class="styled-table">
    <thead>
      <tr>${headerHtml}</tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
`;

        // 🧱 STEP 3️⃣: Replace all tables with a single unified processed table
        const newProcessedTables = [
          {
            Table_Index: 0,
            Table_HTML: unifiedTableHtml,
            processed: true,
          },
        ];

        setProcessedTables(newProcessedTables);
        setCurrentPage(0); // reset pagination
        console.log("🧩 All tables replaced with unified Agentic AI output");
      }

      // ✅ Progress completion
      setProgressStep(3);
      setProcessingStage(4);
      setShowApprovedButton(true);
      setHasProcessedOnce(true);
    } catch (error: any) {
      console.error("❌ Error in process-and-download:", error.message);
      alert(`Processing failed: ${error.message}`);
    } finally {
      setStatementsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (isApproved) return;
    if (!processedJsonData) {
      alert("No processed JSON data available to send.");
      return;
    }

    try {
      setProcessingStage(3);
      setStatementsLoading(true);

      // 🧠 Send JSON file to backend endpoint
      await sendJsonToBDC(processedJsonData, bdc_name);

      // Simulate progress bar completion
      setTimeout(() => {
        setProgressStep(3);
        setProcessingStage(4);
        setIsApproved(true);

        setTimeout(() => {
          setProgressStep(4);
          setProcessingStage(null);
        }, 1500);
      }, 1500);
    } catch (error: any) {
      console.error("❌ Approval step failed:", error.message);
      alert(`Approval failed: ${error.message}`);
    } finally {
      setStatementsLoading(false);
    }
  };

  //Handle Download Excel

  const handleDownloadExcel = async () => {
    const sourceTables = processedTables || groupedReports?.tables;
    if (!sourceTables) {
      alert("No tables available to download.");
      return;
    }
    await downloadExcelSingleSheet(
      sourceTables,
      filingData?.accessionNumber || "statements",
      setStatementsLoading
    );
  };

  const handleDownloadExcelMultiSheet = async () => {
    const sourceTables = processedTables || groupedReports?.tables;
    if (!sourceTables) {
      alert("No tables available to download.");
      return;
    }
    await downloadExcelMultiSheet(
      sourceTables,
      filingData?.accessionNumber || "statements",
      setStatementsLoading
    );
  };

  // Pagination
  const tables = processedTables || groupedReports?.tables?.flat() || [];
  const totalTables = tables.length;
  const currentTable = tables[currentPage] || null;
  const handleNext = () =>
    currentPage < totalTables - 1 && setCurrentPage((p) => p + 1);
  const handlePrev = () => currentPage > 0 && setCurrentPage((p) => p - 1);

  return (
    <div className="flex flex-col bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-800 p-2">
        <h1 className="text-5xl font-bold cursor-pointer hover:bg-[#121212]" onClick={() => router.push("/")}>TIKLE</h1>
        <button
          onClick={() => router.push("/dashboard/view-filings")}
          className="hover:bg-[#808080] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          View Filings
        </button>
      </div>

      {/* Upload Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <File_selection_form
          setStatementsLoading={setStatementsLoading}
          statements_loading={statementsLoading}
          setFilingData={setFilingData}
          setGroupedReports={setGroupedReports}
          setBdcName={set_bdc_name}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-row max-h-[calc(100vh-200px)]">
        {/* Left Section */}
        <div className="flex flex-col w-3/4 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 border-r border-gray-800">
            {groupedReports && groupedReports.tables ? (
              <>
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-blue-400">
                    Schedule of Investments
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadExcel}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      disabled={statementsLoading}
                    >
                      {statementsLoading ? "Preparing" : "📥 Download Excel"}
                    </button>

                    <button
                      onClick={handleDownloadExcelMultiSheet}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      disabled={statementsLoading}
                    >
                      {statementsLoading
                        ? "Preparing"
                        : "📄 Download Excel (Multi-Sheet)"}
                    </button>

                    <button
                      onClick={handleProcessAndDownload}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      disabled={statementsLoading}
                    >
                      {hasProcessedOnce
                        ? "🔁 Reprocess"
                        : "⚙️ Process and Download"}
                    </button>

                    {showApprovedButton && (
                      <button
                        onClick={handleApprove}
                        disabled={isApproved && progressStep === 4}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isApproved && progressStep === 4
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700 text-white"
                        }`}
                      >
                        {isApproved && progressStep === 4
                          ? "✅ Approved"
                          : "Approve and Download"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Display */}
                {currentTable ? (
                  <div
                    key={currentTable.Table_Index || currentPage}
                    className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700"
                  >
                    <p className="text-sm text-gray-400 mb-2">
                      <strong>Table Index:</strong>{" "}
                      {currentTable.Table_Index ?? currentPage}
                    </p>
                    <div
                      className="overflow-auto max-h-[calc(100vh-430px)] text-sm border border-gray-700 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: currentTable.Table_HTML,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 mt-4">No tables to display.</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">
                Please select a filing to view the Schedule of Investments.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalTables > 0 && (
            <div className="flex-shrink-0 border-t border-gray-800 bg-gray-950 p-3 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 0
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                ← Previous
              </button>
              <p className="text-sm text-gray-400">
                Table {currentPage + 1} of {totalTables}
              </p>
              <button
                onClick={handleNext}
                disabled={currentPage === totalTables - 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalTables - 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Progress Tracker */}
        {groupedReports && groupedReports.tables && (
          <div className="w-1/4 p-6 border-l border-gray-800 flex flex-col items-start justify-start">
            <h3 className="text-lg font-semibold text-blue-400 mb-6">
              Processing Progress
            </h3>

            <div className="flex flex-col space-y-8 relative">
              <div className="absolute left-[10px] top-[15px] bottom-[15px] w-[2px] bg-gray-700" />
              <ProgressStep
                label="Portfolio Initiated"
                step={1}
                progressStep={progressStep}
                processingStage={processingStage}
              />
              <ProgressStep
                label="Column Names Standardized"
                step={2}
                progressStep={progressStep}
                processingStage={processingStage}
              />
              <ProgressStep
                label="Waiting for Approval"
                step={3}
                progressStep={progressStep}
                processingStage={processingStage}
              />
              <ProgressStep
                label="SOI Prepared"
                step={4}
                progressStep={progressStep}
                processingStage={processingStage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🧩 Progress Step Component
const ProgressStep = ({
  label,
  step,
  progressStep,
  processingStage,
}: {
  label: string;
  step: number;
  progressStep: number;
  processingStage?: number | null;
}) => {
  const isCompleted = progressStep >= step;
  const isSpinning = processingStage === step;

  return (
    <div className="flex items-start space-x-4">
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isSpinning ? (
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCompleted ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            {isCompleted && "✓"}
          </div>
        )}
      </div>
      <p
        className={`${
          isCompleted ? "text-white" : "text-gray-500"
        } transition-all duration-300`}
      >
        {label}
      </p>
    </div>
  );
};

export default Agent_main;
