'use client'

import Image from "next/image";
import FemaleImage from "@/app/assets/pngs/3d-female.png"; // ✅ Webpack-imported image

export default function DashboardPage() {
  return (
    <div className="flex w-full items-center justify-center pt-30">
      <Image
        src={FemaleImage}
        alt="3D Female Character"
        width={500}
        height={500}
      />
      <h2 className="text-4xl font-semibold text-gray-500">
        OOPS!
        I Guess you are lost
      </h2>
    </div>
  );
}
