import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp } from "lucide-react";

const data = [
  { symbol: "MSIF", price: 17.98, change: 0.73, percent: "4.23%" },
  { symbol: "GECC", price: 11.04, change: 0.33, percent: "3.04%" },
  { symbol: "ICMB", price: 2.83, change: 0.08, percent: "2.91%" },
  { symbol: "PNNT", price: 6.94, change: 0.16, percent: "2.36%" },
  { symbol: "PNNT", price: 6.94, change: 0.16, percent: "2.36%" },
];

export default function Top_Gainers_and_Losers() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xs">
      <h2 className="text-sm font-semibold leading-[1.5] text-center py-[6px] bg-[#215e9b] text-white">
        Today's Outperforming BDCs
      </h2>

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
            {data.map((item, idx) => (
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
                  <span className="inline-flex items-center justify-center gap-1 text-green-600 leading-[1.1]">
                    <ArrowUp size={14} /> {item.change}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-1 leading-[1.1]">
                  <span className="inline-flex items-center justify-center gap-1 text-green-600 leading-[1.1]">
                    <ArrowUp size={14} /> {item.percent}
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
