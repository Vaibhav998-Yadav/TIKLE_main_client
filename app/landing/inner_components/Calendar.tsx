import React from "react";

const calendarData = [
  {
    name: "123 Inc",
    date: "11 Jan 2025",
    bmo: "ARC Corp Ltd.",
    callDate: "16 Sep 2025",
    phone: "+1-852-157-1449",
  },
  {
    name: "SEC Pvt. Ltd.",
    date: "31 Jul 2025",
    bmo: "Google Inc.",
    callDate: "16 Sep 2025",
    phone: "+21-123-456-789",
  },
  {
    name: "NCTB Inc.",
    date: "15 Jun 2024",
    bmo: "Google Ltd.",
    callDate: "16 Sep 2025",
    phone: "+21-585-488-544",
  },
  {
    name: "CMO Operations",
    date: "17 Oct 2025",
    bmo: "CRMS Ltd.",
    callDate: "16 Sep 2025",
    phone: "+64-455-22424-2",
  },
  {
    name: "DRA Pvt. Ltd.",
    date: "11 Nov 2025",
    bmo: "BFO Inc.",
    callDate: "16 Sep 2025",
    phone: "+91-914-9144-95",
  },
  {
    name: "COST Inc. Ltd.",
    date: "18 Aug 2025",
    bmo: "CDMS Pvt Ltd.",
    callDate: "16 Sep 2025",
    phone: "+74-899-452-3",
  },
  {
    name: "NCTB Inc.",
    date: "15 Jun 2024",
    bmo: "Google Ltd.",
    callDate: "16 Sep 2025",
    phone: "+21-585-488-544",
  },
  {
    name: "CMO Operations",
    date: "17 Oct 2025",
    bmo: "CRMS Ltd.",
    callDate: "16 Sep 2025",
    phone: "+64-455-22424-2",
  },
  {
    name: "DRA Pvt. Ltd.",
    date: "11 Nov 2025",
    bmo: "BFO Inc.",
    callDate: "16 Sep 2025",
    phone: "+91-914-9144-95",
  },
  {
    name: "COST Inc. Ltd.",
    date: "18 Aug 2025",
    bmo: "CDMS Pvt Ltd.",
    callDate: "16 Sep 2025",
    phone: "+74-899-452-3",
  }
];

export default function Calendar() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xs">
      {/* Header */}
      <h2 className="text-sm font-semibold leading-[1.5] text-center py-[6px] bg-[#215e9b] text-white">
        Calendar
      </h2>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white min-h-0 max-h-[calc(4*2.7rem)]">
        <table className="w-full text-xs leading-[1.1] text-center border-collapse">
          <thead className="sticky top-0 bg-[#CEE2F6] z-10">
            <tr className="border-b leading-[1.5] h-[33px]">
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                BDC Name
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                Date
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                BMO/AMC
              </th>
              <th className="h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5] text-center">
                Conference Call date
              </th>
            </tr>
          </thead>

          <tbody>
            {calendarData.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-50 transition-colors leading-[1.1] ${
                  idx % 2 === 1 ? "bg-[#F2F2F2]" : "bg-white"
                }`}
              >
                <td className="px-2 py-1 font-medium text-blue-600 text-center leading-[1.1]">
                  {item.name}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.date}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.bmo}
                </td>
                <td className="px-2 py-1 text-center leading-[1.1]">
                  {item.callDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
