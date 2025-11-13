"use client";

import { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";

export default function MySplineScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load("/scene.splinecode"); // public folder path
    }
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
  );
}
