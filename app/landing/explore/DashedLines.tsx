import React, { ReactNode } from "react";

type BackgroundDashedProps = {
  children: ReactNode;
};

export default function BackgroundDashed({ children }: BackgroundDashedProps) {
  // dashed pattern values (static)
  const dash = 8;       // dash length
  const gap = 8;        // gap between dashes
  const thickness = 0.5;  // line thickness
  const color = "lightgrey";
  const spacing = 30;   // vertical distance between lines

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='${spacing}' viewBox='0 0 100 ${spacing}'>
    <line x1='0' y1='${spacing / 2}' x2='100' y2='${spacing / 2}' stroke='${color}' stroke-width='${thickness}' stroke-dasharray='${dash} ${gap}' />
  </svg>`;

  const style: React.CSSProperties = {
    minHeight: "100vh",
    backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    backgroundRepeat: "repeat",
    backgroundSize: `auto ${spacing}px`,
  };

  return <div style={style}>{children}</div>;
}
