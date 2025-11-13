import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown } from "lucide-react";

const losersData = [
  { symbol: "XYZ", price: 5.23, change: -0.42, percent: "-7.43%" },
  { symbol: "ABC", price: 12.11, change: -0.55, percent: "-4.34%" },
  { symbol: "LMN", price: 8.67, change: -0.24, percent: "-2.69%" },
  { symbol: "DEF", price: 3.94, change: -0.09, percent: "-2.23%" },
  { symbol: "TUV", price: 6.58, change: -0.13, percent: "-1.94%" },
];

export default function Top_Losers() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xs">
      {/* Header */}
     <h2 className="text-sm font-semibold leading-[1.5] text-center py-[6px] bg-[#215e9b] text-white">
        Today's Underperforming BDCs
      </h2>

      {/* Table */}
      <div className="w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Table className="w-full text-xs leading-[1.1] text-center border-collapse">
                <TableHeader className="sticky top-0 bg-[#CEE2F6] z-10">
                  <TableRow className="border-b leading-[1.5] h-[33px]">
                    <TableHead className="text-center !h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5]">
                      Symbol
                    </TableHead>
                    <TableHead className="text-center !h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5]">
                      Price
                    </TableHead>
                    <TableHead className="text-center !h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5]">
                      Change
                    </TableHead>
                    <TableHead className="text-center !h-[33px] px-[6px] font-semibold text-sm align-middle leading-[1.5]">
                      % Change
                    </TableHead>
                  </TableRow>
                </TableHeader>

          <TableBody>
            {losersData.map((item, idx) => (
              <TableRow
                key={item.symbol + idx}
                className="!p-0 leading-[1.1] hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-2 py-1 font-medium text-blue-600 cursor-pointer leading-[1.1]">
                  {item.symbol}
                </TableCell>
                <TableCell className="px-2 py-1 leading-[1.1]">
                  {item.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-2 py-1 leading-[1.1]">
                  <span className="inline-flex items-center justify-center gap-1 text-red-600 leading-[1.1]">
                    <ArrowDown size={14} /> {item.change}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-1 leading-[1.1]">
                  <span className="inline-flex items-center justify-center gap-1 text-red-600 leading-[1.1]">
                    <ArrowDown size={14} /> {item.percent}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
