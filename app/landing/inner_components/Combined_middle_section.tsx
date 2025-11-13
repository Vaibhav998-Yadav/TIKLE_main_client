"use client";
import React from "react";
import Top_Gainers from "./Top_gainers";
import Top_Losers from "./Top_losers";
import Calendar from "./Calendar";
import Exchange_Rates from "./Exchange_Rates";
import Last_Table from "./Last_Table";

const Combined_middle_section = () => {
  return (
    <div className="grid grid-cols-[21%_40%_37%] gap-4 h-[95%] mt-5 min-h-0">
      {/* Left column */}
      <div className="flex flex-col gap-4 h-full min-h-0">
        <div className="flex-1 min-h-0">
        <Top_Gainers />
        </div>
        <div className="flex-1 min-h-0">
        <Top_Losers />
        </div>
      </div>

      {/* Middle column */}
      <div className="flex flex-col gap-4 h-full min-h-0">
        <div className="flex-1 min-h-0">
          <Calendar />
        </div>
        <div className="flex-1 min-h-0">
          <Exchange_Rates />
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col h-full min-h-0">
        <Last_Table />
      </div>
    </div>
  );
};

export default Combined_middle_section;
