import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bdcData = [
  { name: "ARCC", nii: "", eps: "", div: "", nav: "" },
  { name: "OBDC", nii: "", eps: "", div: "", nav: "" },
  { name: "BBDC", nii: "", eps: "", div: "", nav: "" },
  { name: "GBDC", nii: "", eps: "", div: "", nav: "" },
  { name: "GSBD", nii: "", eps: "", div: "", nav: "" },
];

export default function BDC_Table_Data() {
  return (
    <div className="w-full h-full flex flex-col p-2 shadow-md">
      <h2 className="text-base font-semibold mb-3 text-blue">
        Top 5 BDC (Total assets/AUM)
      </h2>
      <div className="bg-[#f3e3e3] overflow-hidden text-black h-full">
        <Table className="w-full text-xs leading-tight">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">
                Top 5 BDC (Total assets/AUM)
              </TableHead>
              <TableHead>NII/share</TableHead>
              <TableHead>EPS/share</TableHead>
              <TableHead>Div/Share</TableHead>
              <TableHead>NAV/share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bdcData.map((item, idx) => (
              <TableRow
                key={idx}
                className={idx % 2 === 1 ? "bg-white" : "bg-[#e8d4d4]"}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.nii}</TableCell>
                <TableCell>{item.eps}</TableCell>
                <TableCell>{item.div}</TableCell>
                <TableCell>{item.nav}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
