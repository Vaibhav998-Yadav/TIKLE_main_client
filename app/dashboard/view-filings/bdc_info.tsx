"use client";

import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import KeyIconTailwind from "@/app/assets/svgs/KeyIconTailwind";
import { Component } from "lucide-react";
import SearchMagnify from "@/app/assets/svgs/SearchMagnify";
import Calender from "@/app/assets/svgs/Calender";
import Exchange from "@/app/assets/svgs/Exchange";
import { useAppSelector } from "@/app/redux/hooks";

type Props = {
  information: {
    name: string;
    component?: React.ReactNode;
    [key: string]: any;
    badge_color: string;
    component_color: string;
    value: string;
  };
};

const Info_Card = ({ information }: Props) => {
  return (
    <Card className="p-0 grid-rows-2 gap-0">
      <div className="grid grid-cols-7 p-2 items-center border-b">
        <div>
          <Badge
            className="h-8 min-w-8 rounded-full px-1 font-mono tabular-nums"
            style={{ backgroundColor: information.badge_color }}
          >
            {information.component}
          </Badge>
        </div>
        <div className="col-span-6">{information["name"]}</div>
      </div>
      <div className="row-span-full font-bold text-lg pl-3 pt-5 pb-5">
        {information["value"]}
      </div>
    </Card>
  );
};

// const headers = () => {
//   const list = [
//     {
//       key: 1,
//       name: "CIK",
//       component: <KeyIconTailwind color="#3D3DEA" />,
//       badge_color: "#E0E8FF",
//       component_color: "#3D3DEA",
//     },
//     {
//       key: 2,
//       name: "Tickers",
//       component: <SearchMagnify color="#B63DEA" />,
//       badge_color: "#F1DFFF",
//       component_color: "#B63DEA",
//     },
//     {
//       key: 3,
//       name: "Fiscal Year End",
//       component: <Calender color="#15C972" />,
//       badge_color: "#DAFFED",
//       component_color: "#15C972",
//     },
//     {
//       key: 4,
//       name: "Exchanges",
//       component: <Exchange color="#C4D50F" />,
//       badge_color: "#F8FFD3",
//       component_color: "#C4D50F",
//     },
//   ];

//   return list;
// };

const formatFiscalYearEnd = (fye?: string) => {
  if (!fye || fye.length !== 4) return null;

  const month = fye.slice(0, 2);
  const day = fye.slice(2, 4);

  const months: Record<string, string> = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  return `${months[month] || "Invalid"} ${day}`;
};

export const BDC_info = () => {
  const data = useAppSelector((state) => state.bdcMeta.data);

  const formatValue = (field: unknown): string => {
    if (Array.isArray(field)) {
      return field.length > 0 ? field.join(", ") : "N/A";
    }
    if (typeof field === "string") {
      return field || "N/A";
    }
    return "N/A";
  };

  const headers = [
    {
      key: 1,
      name: "CIK",
      component: <KeyIconTailwind color="#3D3DEA" />,
      badge_color: "#E0E8FF",
      component_color: "#3D3DEA",
      value: data?.cik?.replace(/^0+/, "") || "N/A",
    },
    {
      key: 2,
      name: "Tickers",
      component: <SearchMagnify color="#B63DEA" />,
      badge_color: "#F1DFFF",
      component_color: "#B63DEA",
      value: formatValue(data?.tickers),
    },
    {
      key: 3,
      name: "Fiscal Year End",
      component: <Calender color="#15C972" />,
      badge_color: "#DAFFED",
      component_color: "#15C972",
      value: formatFiscalYearEnd(data?.fiscalYearEnd) || "N/A",
    },
    {
      key: 4,
      name: "Exchanges",
      component: <Exchange color="#C4D50F" />,
      badge_color: "#F8FFD3",
      component_color: "#C4D50F",
      value: formatValue(data?.exchanges),
    },
  ];

  return (
    <div className="p-4">
      <div
        style={{
          width: "100%",
          height: "6rem",
          background: "white",
          boxShadow: "1px 1px 5px 1px #E4E4E7",
          position: "relative",
        }}
      >
        {/* top row: names (dark background with white text) */}
        <div
          style={{ width: "100%", height: "40%", background: "#081028" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {headers.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-center text-white"
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* bottom row: icons / badges + values */}
        <div
          style={{
            width: "100%",
            height: "60%",
            background: "white",
            padding: "10px 0px 10px 0px",
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {headers.map((item, index) => (
            <div
              key={item.key}
              style={{
                color: "black",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: index === headers.length - 1 ? "none" : "1px solid #E4E4E4",
              }}
            >
              {/* Replace print(Props) with actual JSX using `item`. */}
              <div className="flex flex-col items-center justify-center">
                <div className="mt-2 text-lg font-bold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
