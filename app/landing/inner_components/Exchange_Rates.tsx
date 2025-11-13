import React from "react";

const sofrData = [
  { date: "27 Sep 2025", daily: "5.33", avg30: "5.31", avg90: "5.28", avg180: "5.25" },
  { date: "26 Sep 2025", daily: "5.32", avg30: "5.30", avg90: "5.27", avg180: "5.24" },
  { date: "25 Sep 2025", daily: "5.31", avg30: "5.29", avg90: "5.27", avg180: "5.23" },
  { date: "26 Sep 2025", daily: "5.32", avg30: "5.30", avg90: "5.27", avg180: "5.24" },
  { date: "25 Sep 2025", daily: "5.31", avg30: "5.29", avg90: "5.27", avg180: "5.23" },
  { date: "25 Sep 2025", daily: "5.31", avg30: "5.29", avg90: "5.27", avg180: "5.23" },
  { date: "26 Sep 2025", daily: "5.32", avg30: "5.30", avg90: "5.27", avg180: "5.24" },
  { date: "25 Sep 2025", daily: "5.31", avg30: "5.29", avg90: "5.27", avg180: "5.23" },
];

export default function Exchange_Rates() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xs">
      {/* Header */}
      <h2 className="text-sm font-semibold leading-[1.5] text-center py-[6px] bg-[#215e9b] text-white">
        SOFR Rates
      </h2>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white min-h-0 max-h-[calc(4*2.7rem)]">
        <table className="w-full text-xs leading-[1.1] text-center border-collapse">
          <thead className="sticky top-0 bg-[#CEE2F6] z-10">
            <tr className="border-b leading-[1.5] h-[33px]">
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                Date
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                Daily
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                30-Day Avg
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                90-Day Avg
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                180-Day Avg
              </th>
            </tr>
          </thead>

          <tbody>
            {sofrData.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 transition-colors leading-[1.1] ${
                  idx % 2 === 1 ? "bg-[#F2F2F2]" : "bg-white"
                }`}
              >
                <td className="px-2 py-1 font-medium text-blue-600 text-center leading-[1.1]">
                  {item.date}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.daily}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.avg30}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.avg90}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.avg180}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
