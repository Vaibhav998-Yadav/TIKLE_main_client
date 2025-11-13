"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button"; // adjust the path if needed

interface TableData {
  id: string;
  text: string;
  table_html: string;
}

interface Props {
  tables: { data: TableData[] } | null;
}

const FinancialStatementsSidebar: React.FC<Props> = ({ tables }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!tables?.data?.length) return null;

  const selectedTable = tables.data.find((table) => table.id === selectedId);

  const handleDownload = () => {
    if (!selectedTable?.table_html) return;

    // Create a DOM parser to extract the table element
    const parser = new DOMParser();
    const doc = parser.parseFromString(selectedTable.table_html, "text/html");
    const tableElement = doc.querySelector("table");

    if (!tableElement) {
      alert("Table element not found.");
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(tableElement);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statement");

    const filename = `${selectedTable.text.replace(/\s+/g, "_")}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="flex w-full gap-6">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 h-fit sticky top-4">
        <h2 className="text-lg font-semibold mb-4">Financial Statements</h2>
        <ul className="space-y-2">
          {tables.data.map((report) => (
            <li key={report.id}>
              <button
                onClick={() => setSelectedId(report.id)}
                className={`block w-full text-left p-2 rounded hover:bg-gray-200 text-sm ${
                  selectedId === report.id ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {report.text}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Single Table Viewer */}
      <div className="flex-1 overflow-y-auto pr-4">
        {selectedTable ? (
          <section key={selectedTable.id} id={selectedTable.id}>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "10px" }}
            >
              <h3 className="text-lg font-semibold">{selectedTable.text}</h3>
              <Button onClick={handleDownload}>Download Excel</Button>
            </div>

            <div
              className="border border-gray-300 rounded p-2 overflow-auto text-sm w-full"
              dangerouslySetInnerHTML={{ __html: selectedTable.table_html!= "No <table> tag found."?selectedTable.table_html: "Data not available"  }}
              style={{ maxHeight: "500px" }}
            />
          </section>
        ) : (
          <p className="text-gray-500" style={{marginTop: "10px"}}>Select a statement from the sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialStatementsSidebar;
