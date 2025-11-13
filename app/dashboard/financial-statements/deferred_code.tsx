// "use client";

// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/app/redux/hooks";
// import Fetch_financial_statements_form from "./fetch_financial_statements_form";
// import { fetch_financial_statement } from "@/app/services/api/fetch_financial_statements";
// import FinancialStatementsSidebar from "./FinancialStatementsSidebar";
// import { FileText } from "lucide-react";

// type FilingData = {
//   accessionNumber: string;
//   primaryDocument: string;
// };

// export default function Page() {
//   const { data } = useAppSelector((state) => state.bdcMeta);
//   const [filingData, setFilingData] = useState<FilingData | null>(null);
//   const [tables, setTables] = useState<any | null>(null);
//   const [statements_loading, set_statements_loading] = useState(false);

//   // 🧠 Fetch SEC tables when both CIK and filingData are available
//   useEffect(() => {
//     const loadStatement = async () => {
//       if (data?.cik && filingData?.accessionNumber) {
//         console.log(filingData);
//         try {
//           const result = await fetch_financial_statement(
//             data.cik,
//             filingData.accessionNumber
//           );
//           setTables(result);
//           console.log("Fetched tables:", result);
//         } catch (error) {
//           console.error("Error fetching statement:", error);
//         } finally {
//           set_statements_loading(false);
//         }
//       }
//     };

//     loadStatement();
//   }, [data?.cik, filingData?.accessionNumber]);

//   return (
//     <div className="p-4">
//       <div className="flex gap-6 items-center">
//         {/* Left side: Form */}
//         <div className="w-1/2">
//           <Fetch_financial_statements_form
//             setStatementsLoading={set_statements_loading}
//             statements_loading={statements_loading}
//             setFilingData={setFilingData} // ✅ Single source of truth
//             // onAccessionSelect is now redundant and can be removed
//           />
//         </div>

//         {/* Right side: Company name centered */}
//         <div className="flex-1 text-center">
//           <b>{data?.name}</b>
//         </div>
//       </div>
//       {data?.cik && filingData?.accessionNumber && (
//         <div className="mt-4">
//           <a
//             href={`https://www.sec.gov/Archives/edgar/data/${
//               data.cik
//             }/${filingData.accessionNumber.replace(/-/g, "")}/${
//               filingData.primaryDocument
//             }`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 px-4 py-2 font-medium hover:bg-[#3a4f80]"
//           >
//             <FileText className="w-4 h-4" />
//             View Filing
//           </a>
//         </div>
//       )}

//       <FinancialStatementsSidebar tables={tables} />
//     </div>
//   );
// }
