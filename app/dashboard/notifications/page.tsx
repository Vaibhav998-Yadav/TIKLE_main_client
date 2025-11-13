"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { newDocsNotification } from "@/app/services/api/new_docs_notifications";

type NotificationDoc = {
  _id: string;
  form: string;
  filingDate: string;
  reportDate: string;
  cikName: string;
  accessionNumber: string;
  ciknumber: number;
  primaryDocument: string;
};

type SortKey = "filingDate" | "reportDate";

export default function NotificationsTable() {
  const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
  const [formFilter, setFormFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("filingDate");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await newDocsNotification();
      if (data) setNotifications(data);
    };
    fetchData();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let data = [...notifications];

    if (formFilter !== "all") {
      data = data.filter((item) => item.form === formFilter);
    }

    data.sort((a, b) => {
      const dateA = new Date(a[sortKey] || "1970-01-01");
      const dateB = new Date(b[sortKey] || "1970-01-01");
      return sortAsc
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return data;
  }, [notifications, formFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage);

  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filters and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Recent Filings</h2>
        <div className="flex items-center gap-4">
          <Select value={formFilter} onValueChange={setFormFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              <SelectItem value="10-K">10-K</SelectItem>
              <SelectItem value="10-Q">10-Q</SelectItem>
              <SelectItem value="8-K">8-K</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() =>
              setSortKey((prev) =>
                prev === "filingDate" ? "reportDate" : "filingDate"
              )
            }
          >
            Sort by: {sortKey === "filingDate" ? "Filing Date" : "Report Date"}
          </Button>

          <Button variant="ghost" onClick={() => setSortAsc((prev) => !prev)}>
            {sortAsc ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-auto max-h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[200px]">BDC Name</TableHead>
              <TableHead className="w-[100px]">Form</TableHead>
              <TableHead className="w-[150px]">Filing Date</TableHead>
              <TableHead className="w-[150px]">Report Date</TableHead>
              <TableHead className="w-[150px]">Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="w-[200px]">{item.cikName}</TableCell>
                <TableCell className="w-[100px]">{item.form}</TableCell>
                <TableCell className="w-[150px]">{item.filingDate}</TableCell>
                <TableCell className="w-[150px]">
                  {item.reportDate || "-"}
                </TableCell>
                <TableCell className="w-[150px]">
                  <a
                    href={`https://www.sec.gov/Archives/edgar/data/${
                      item.ciknumber
                    }/${item.accessionNumber.replace(/-/g, "")}/${
                      item.primaryDocument
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          Rows per page:
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
