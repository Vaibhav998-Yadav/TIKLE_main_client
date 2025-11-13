"use client";

import { useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  TableIcon,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Html5 } from "@/app/assets/svgs/Html5";
import {
  exportTablesToExcel,
  singleSheetStatement,
} from "@/app/utils/html_to_excel";
import EyeIcon from "@/app/assets/svgs/Preview";

interface ReportData {
  id: number;
  formType: string;
  filingDate: string;
  reportingDate: string;
  cik?: string;
  accessionNumber?: string;
  primaryDocument?: string;
  [key: string]: any;
}

type SortField = "filingDate" | "reportingDate" | null;
type SortDirection = "asc" | "desc";

const sampleData: ReportData[] = [
  {
    id: 1,
    formType: "10-Q",
    filingDate: "2025-05-07",
    reportingDate: "2025-06-08",
  },
  {
    id: 2,
    formType: "10-K",
    filingDate: "2025-03-15",
    reportingDate: "2025-04-16",
  },
  {
    id: 3,
    formType: "8-K",
    filingDate: "2025-05-01",
    reportingDate: "2025-05-02",
  },
  {
    id: 4,
    formType: "10-Q",
    filingDate: "2025-02-07",
    reportingDate: "2025-03-08",
  },
  {
    id: 5,
    formType: "N-CSR",
    filingDate: "2025-01-20",
    reportingDate: "2025-02-21",
  },
  {
    id: 6,
    formType: "8-K",
    filingDate: "2025-04-12",
    reportingDate: "2025-04-13",
  },
  {
    id: 7,
    formType: "10-K",
    filingDate: "2024-12-31",
    reportingDate: "2025-01-31",
  },
  {
    id: 8,
    formType: "10-Q",
    filingDate: "2025-05-07",
    reportingDate: "2025-06-08",
  },
  {
    id: 9,
    formType: "N-CSR",
    filingDate: "2025-03-10",
    reportingDate: "2025-04-11",
  },
  {
    id: 10,
    formType: "8-K",
    filingDate: "2025-05-20",
    reportingDate: "2025-05-21",
  },
];

const formTypeOptions = ["10-K", "10-Q", "8-K", "N-CSR"];

export function View_all_filings_table() {
  const [rowsPerPage, setRowsPerPage] = useState("15");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFormTypes, setSelectedFormTypes] = useState<string[]>([]);
  const [filingDateFrom, setFilingDateFrom] = useState("");
  const [filingDateTo, setFilingDateTo] = useState("");
  const [reportingDateFrom, setReportingDateFrom] = useState("");
  const [reportingDateTo, setReportingDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const data = useAppSelector((state) => state.bdcMeta.data);

  // const totalResults = sampleData.length;

  // console.log(data ? JSON.parse(data["recent_filings_array"]) : null);

  const rawData: ReportData[] = data?.recent_filings_array
    ? JSON.parse(data.recent_filings_array).map((item: any, index: any) => ({
        ...item,
        id: index + 1,
        cik: data.cik || "", // 🔧 inject global cik into each row
        formType: item.form || "",
        filingDate: item.filingDate || "",
        reportingDate: item.reportDate || "",
      }))
    : sampleData;

  const filteredAndSortedData = rawData
    .filter((report) => {
      if (
        selectedFormTypes.length > 0 &&
        !selectedFormTypes.includes(report.formType)
      )
        return false;

      if (filingDateFrom && report.filingDate < filingDateFrom) return false;
      if (filingDateTo && report.filingDate > filingDateTo) return false;

      if (reportingDateFrom && report.reportingDate < reportingDateFrom)
        return false;
      if (reportingDateTo && report.reportingDate > reportingDateTo)
        return false;

      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const totalPages = Math.ceil(
    filteredAndSortedData.length / Number(rowsPerPage)
  );

  const handleDownload = (format: "pdf" | "csv", reportId: number) => {
    // console.log(`Downloading ${format.toUpperCase()} for report ${reportId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const currentPageRows = filteredAndSortedData.slice(
    (currentPage - 1) * Number(rowsPerPage),
    currentPage * Number(rowsPerPage)
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-gray-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-gray-600" />
    );
  };

  const handleFormTypeToggle = (formType: string) => {
    setSelectedFormTypes((prev) =>
      prev.includes(formType)
        ? prev.filter((type) => type !== formType)
        : [...prev, formType]
    );
  };

  const clearFormTypeFilters = () => {
    setSelectedFormTypes([]);
  };

  const clearFilingDateFilter = () => {
    setFilingDateFrom("");
    setFilingDateTo("");
  };

  const clearReportingDateFilter = () => {
    setReportingDateFrom("");
    setReportingDateTo("");
  };

  const hasFilingDateFilter = filingDateFrom || filingDateTo;
  const hasReportingDateFilter = reportingDateFrom || reportingDateTo;

  const excel_download_onclick = async (
    url: string,
    reportId: number,
    useSingleSheet = false
  ) => {
    setDownloadingId(reportId);

    try {
      await exportTablesToExcel(url, useSingleSheet);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Fixed Header Table Container */}
      <div className="border overflow-hidden">
        <div className="relative">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#d9d9d9" }}>

                  <TableHead className="font-medium text-gray-700 w-1/4 sticky top-0">
                    <div className="flex items-center gap-2">
                      Form Type
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                          >
                            <Filter className="h-3 w-3 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <div className="p-2">
                            <div className="text-sm font-medium mb-2">
                              Filter by Form Type
                            </div>
                            <div className="space-y-1">
                              {formTypeOptions.map((formType) => (
                                <div
                                  key={formType}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={`filter-${formType}`}
                                    checked={selectedFormTypes.includes(
                                      formType
                                    )}
                                    onChange={() =>
                                      handleFormTypeToggle(formType)
                                    }
                                    className="rounded border-gray-300"
                                  />
                                  <label
                                    htmlFor={`filter-${formType}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {formType}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {selectedFormTypes.length > 0 && (
                              <div className="mt-3 pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={clearFormTypeFilters}
                                  className="w-full text-xs"
                                >
                                  Clear all
                                </Button>
                              </div>
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {selectedFormTypes.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedFormTypes.length}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-1/4 sticky top-0">
                    <div className="flex items-center gap-2">
                      Filing Date
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Filter className="h-3 w-3 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64">
                            <div className="p-3">
                              <div className="text-sm font-medium mb-3">
                                Filter by Filing Date
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <Label
                                    htmlFor="filing-date-from"
                                    className="text-xs"
                                  >
                                    From
                                  </Label>
                                  <Input
                                    id="filing-date-from"
                                    type="date"
                                    value={filingDateFrom}
                                    onChange={(e) =>
                                      setFilingDateFrom(e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="filing-date-to"
                                    className="text-xs"
                                  >
                                    To
                                  </Label>
                                  <Input
                                    id="filing-date-to"
                                    type="date"
                                    value={filingDateTo}
                                    onChange={(e) =>
                                      setFilingDateTo(e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              {hasFilingDateFilter && (
                                <div className="mt-3 pt-2 border-t">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilingDateFilter}
                                    className="w-full text-xs"
                                  >
                                    Clear filter
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          onClick={() => handleSort("filingDate")}
                        >
                          {getSortIcon("filingDate")}
                        </Button>
                      </div>
                      {hasFilingDateFilter && (
                        <Badge variant="secondary" className="text-xs">
                          1
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-1/4 sticky top-0">
                    <div className="flex items-center gap-2">
                      Reporting Date
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Filter className="h-3 w-3 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64">
                            <div className="p-3">
                              <div className="text-sm font-medium mb-3">
                                Filter by Reporting Date
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <Label
                                    htmlFor="reporting-date-from"
                                    className="text-xs"
                                  >
                                    From
                                  </Label>
                                  <Input
                                    id="reporting-date-from"
                                    type="date"
                                    value={reportingDateFrom}
                                    onChange={(e) =>
                                      setReportingDateFrom(e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="reporting-date-to"
                                    className="text-xs"
                                  >
                                    To
                                  </Label>
                                  <Input
                                    id="reporting-date-to"
                                    type="date"
                                    value={reportingDateTo}
                                    onChange={(e) =>
                                      setReportingDateTo(e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              {hasReportingDateFilter && (
                                <div className="mt-3 pt-2 border-t">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearReportingDateFilter}
                                    className="w-full text-xs"
                                  >
                                    Clear filter
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          onClick={() => handleSort("reportingDate")}
                        >
                          {getSortIcon("reportingDate")}
                        </Button>
                      </div>
                      {hasReportingDateFilter && (
                        <Badge variant="secondary" className="text-xs">
                          1
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-1/4 text-center sticky top-0">
                    Preview and Download
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Body */}
          <div style={{ maxHeight: "330px", overflow: "scroll" }}>
            <Table>
              <TableBody>
                {filteredAndSortedData
                  .slice(
                    (currentPage - 1) * Number(rowsPerPage),
                    currentPage * Number(rowsPerPage)
                  )
                  .map((report, index) => (
                    <TableRow
                      key={report.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#FFFFFF" : "#e9eaef",
                      }}
                    >
                      <TableCell className="font-medium w-1/4">
                        {report.formType}
                      </TableCell>
                      <TableCell className="w-1/4">
                        {report.filingDate}
                      </TableCell>
                      <TableCell className="w-1/4">
                        {report.reportingDate ? report.reportingDate : "-"}
                      </TableCell>
                      <TableCell className="text-center w-1/4">
                        <div className="flex items-center justify-center gap-2">
                          {/* <div className="w-8 h-8 rounded flex items-center justify-center">
                            {report.cik &&
                            report.accessionNumber &&
                            report.primaryDocument ? (
                              <a
                                href={`https://www.sec.gov/ix?doc=/Archives/edgar/data/${report.cik.padStart(
                                  10,
                                  "0"
                                )}/${report.accessionNumber.replace(
                                  /-/g,
                                  ""
                                )}/${report.primaryDocument}`}
                                className="text-blue-700 cursor-pointer hover:text-black text-xs font-bold"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                XBRL
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">N/A</span>
                            )}
                          </div> */}
                          {report.cik &&
                          report.accessionNumber &&
                          report.primaryDocument ? (
                            <a
                              href={`https://www.sec.gov/Archives/edgar/data/${report.cik.padStart(
                                10,
                                "0"
                              )}/${report.accessionNumber.replace(/-/g, "")}/${
                                report.primaryDocument
                              }`}
                              className="flex items-center gap-1 text-blue-700 cursor-pointer hover:text-black text-xs font-bold"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <EyeIcon />
                              {/* Preview */}
                              <p style={{ color: "black" }}>View</p>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                          <>
                            {downloadingId === report.id ? (
                              <Button size="sm" variant="ghost" disabled>
                                <Loader2Icon className="animate-spin mr-2" />
                                Downloading...
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const cik = report?.cik ?? "";
                                      const accession =
                                        report?.accessionNumber ?? "";
                                      const doc = report?.primaryDocument ?? "";

                                      const url = `https://www.sec.gov/Archives/edgar/data/${cik.padStart(
                                        10,
                                        "0"
                                      )}/${accession.replace(/-/g, "")}/${doc}`;

                                      excel_download_onclick(
                                        url,
                                        report.id,
                                        false
                                      ); // ❗ multi-sheet
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <TableIcon className="h-4 w-4 text-green-600" />
                                    Excel (Multi-Sheet)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const cik = report?.cik ?? "";
                                      const accession =
                                        report?.accessionNumber ?? "";
                                      const doc = report?.primaryDocument ?? "";

                                      const url = `https://www.sec.gov/Archives/edgar/data/${cik.padStart(
                                        10,
                                        "0"
                                      )}/${accession.replace(/-/g, "")}/${doc}`;

                                      excel_download_onclick(
                                        url,
                                        report.id,
                                        true
                                      ); // ❗ single-sheet
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <TableIcon className="h-4 w-4 text-blue-600" />
                                    Excel (Single-Sheet)
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Viewing {currentPageRows.length} of {filteredAndSortedData.length}{" "}
          results
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
