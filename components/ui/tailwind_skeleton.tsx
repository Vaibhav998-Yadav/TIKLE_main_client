"use client";

import React, { useEffect, useState } from "react";

const ROW_HEIGHT_PX = 65; // Approximate height of each skeleton row

const TailwindSkeleton: React.FC = () => {
  const [rowCount, setRowCount] = useState(10);

  useEffect(() => {
    const updateRowCount = () => {
      const screenHeight = window.innerHeight;
      const padding = 48; // estimated vertical padding/margin
      const rows = Math.floor((screenHeight - padding) / ROW_HEIGHT_PX);
      setRowCount(rows);
    };

    updateRowCount(); // Initial
    window.addEventListener("resize", updateRowCount); // Recalculate on resize
    return () => window.removeEventListener("resize", updateRowCount);
  }, []);

  return (
    <div
      role="status"
      className="w-full h-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={i} className="flex items-center justify-between pt-5 first:pt-0">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
      ))}
    </div>
  );
};

export default TailwindSkeleton;
