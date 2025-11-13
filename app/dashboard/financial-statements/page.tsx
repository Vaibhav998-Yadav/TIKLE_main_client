"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarContentTables from "./SidebarContentTables";
import FetchFinancialStatementsForm from "./fetch_financial_statements_form";

export default function SidebarWithContent() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string>("Cover");
  const [groupedReports, setGroupedReports] = useState<Record<string, any[]> | null>(null);

  const [statementsLoading, setStatementsLoading] = useState(false);
  const [filingData, setFilingData] = useState<{
    accessionNumber: string;
    primaryDocument: string;
  } | null>(null);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // ✅ Log grouped reports when updated
  useEffect(() => {
    // if (groupedReports) console.log("✅ Grouped Reports updated:", groupedReports);
  }, [groupedReports]);

  // ✅ Convert groupedReports → dynamic sidebar structure
  const dynamicMenuItems = useMemo(() => {
    if (!groupedReports) return [];

    return Object.entries(groupedReports).map(([category, reports]) => ({
      title: category,
      children: reports.map((r: any) => ({
        title: r.shortName,
        htmlFileName: r.htmlFileName,
        role: r.role,
        position: r.position,
      })),
    }));
  }, [groupedReports]);

  const handleSubItemClick = (itemTitle: string) => {
    setActiveItem(itemTitle);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] border border-border rounded-lg overflow-hidden">
      {/* ===== TOP FORM ===== */}
      <div className="border-b p-4 bg-background">
        <FetchFinancialStatementsForm
          setStatementsLoading={setStatementsLoading}
          statements_loading={statementsLoading}
          setFilingData={setFilingData}
          setGroupedReports={setGroupedReports}
        />
      </div>

      {/* ===== LAYOUT ===== */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-250px)]">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside
          className={cn(
            "w-72 border-r border-border bg-background p-4 flex flex-col justify-between",
            "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent"
          )}
        >
          <div className="flex-1">
            <nav className="space-y-1">
              {/* Placeholder before fetching */}
              {!groupedReports && (
                <p className="text-sm text-muted-foreground">
                  Fetch financial statements to load sections.
                </p>
              )}

              {/* Dynamic sections */}
              {dynamicMenuItems.map((item) => {
                const isOpen = openMenus[item.title];

                return (
                  <div key={item.title}>
                    {/* Category Header */}
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {/* Subitems */}
                    {isOpen && item.children?.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                        {item.children.map((sub) => (
                          <button
                            key={sub.title}
                            onClick={() => handleSubItemClick(sub.title)}
                            className={cn(
                              "block w-full text-left rounded-md px-3 py-1.5 text-sm transition-all",
                              activeItem === sub.title
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <footer className="text-xs text-muted-foreground px-2 mt-4">
            © 2025 TIKLE by Decipher Financials
          </footer>
        </aside>

        {/* ===== RIGHT CONTENT ===== */}
        <main className="flex-1 p-8 overflow-hidden bg-muted/10 h-full">
          <h1 className="text-2xl font-semibold mb-4">{activeItem}</h1>

          {/* Dynamic Report Rendering */}
          {groupedReports ? (
            <SidebarContentTables
              activeItem={activeItem}
              filingData={filingData}
              statementsLoading={statementsLoading}
              groupedReports={groupedReports}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              No report selected. Please fetch a filing.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
