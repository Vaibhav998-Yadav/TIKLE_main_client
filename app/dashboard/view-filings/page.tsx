'use client';

import { useAppSelector } from "@/app/redux/hooks";
import { Separator } from "@/components/ui/separator";
import { Fetch_data_form } from "./fetch_data_form";
import { BDC_info } from "./bdc_info";
import { View_all_filings_table } from "./data_table/view_all_filings_table";

export default function View_filings_page() {
  const { data, status } = useAppSelector((state) => state.bdcMeta);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 bg-white">
        <div className="flex w-full max-w-sm items-center gap-2">
          <h1 className="text-xl font-bold text-[#000082]">
            {status === "loading" || !data
              ? "Loading..."
              : data.name || "Company Name Not Found"}
          </h1>
        </div>
        <div></div>
        <div className="flex w-full items-center gap-2 justify-end">
          <Fetch_data_form />
        </div>
      </div>

      <Separator />
      <BDC_info />
      <div className="p-4 pt-0">
        <View_all_filings_table />
      </div>
    </div>
  );
}
