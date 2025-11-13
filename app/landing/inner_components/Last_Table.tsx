import React from "react";

const Last_Table = () => {
  const columns = [
    "Top 5 BDC",
    "NII/share",
    "EPS/share",
    "Div/Share",
    "NAV/share",
  ];

  const data = [
    { name: "ARCC", nii: "$2.45", eps: "$2.10", div: "$1.92", nav: "$18.50" },
    { name: "OBDC", nii: "$1.85", eps: "$1.65", div: "$1.56", nav: "$16.20" },
    { name: "BBDC", nii: "$1.92", eps: "$1.75", div: "$1.68", nav: "$10.15" },
    { name: "GBDC", nii: "$1.68", eps: "$1.52", div: "$1.44", nav: "$14.80" },
    { name: "GSBD", nii: "$2.15", eps: "$1.95", div: "$1.80", nav: "$17.30" },
    { name: "TSLX", nii: "$2.30", eps: "$2.05", div: "$1.84", nav: "$19.75" },
    { name: "PSEC", nii: "$1.45", eps: "$1.28", div: "$1.20", nav: "$8.90" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
    { name: "MAIN", nii: "$2.80", eps: "$2.52", div: "$2.28", nav: "$24.50" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xs min-h-0">
      <h2 className="text-sm font-semibold leading-[1.5] text-center py-[6px] bg-[#215e9b] text-white flex-shrink-0">
        Top BDC's Overview
      </h2>

      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <table className="w-full text-xs leading-[1.1] text-center border-collapse">
          <thead className="sticky top-0 bg-[#CEE2F6] z-10">
            <tr className="border-b leading-[1.5] h-[33px]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 transition-colors leading-[1.1] ${
                  idx % 2 === 1 ? "bg-[#f2f2f2]" : "bg-white"
                }`}
              >
                <td className="px-2 py-1 font-medium text-blue-600 text-center leading-[1.1]">
                  {row.name}
                </td>
                <td className="px-2 py-1">{row.nii}</td>
                <td className="px-2 py-1">{row.eps}</td>
                <td className="px-2 py-1">{row.div}</td>
                <td className="px-2 py-1">{row.nav}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Last_Table;
