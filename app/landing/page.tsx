"use client";

import Combined_middle_section from "./inner_components/Combined_middle_section";
import Top_section from "./inner_components/Top_section";
import Bottom_Section from "./inner_components/Bottom_Section";

export default function Component() {
  return (
    <div
      className="h-screen flex flex-col p-4 gap-3 min-h-0"
      style={{ backgroundColor: "#EEF5FC" }}
    >
      {/* Top Section */}
      <div className="flex-[1] min-h-0">
        <Top_section />
      </div>

      {/* Middle Section (scroll happens inside subcomponents) */}
      <div className="flex-[6] min-h-0">
        <Combined_middle_section />
      </div>

      {/* Bottom Section */}
      <div className="flex-[2] min-h-0">
        <Bottom_Section />
      </div>
    </div>
  );
}
