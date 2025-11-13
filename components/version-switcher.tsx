"use client";
import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import NextImage from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function VersionSwitcher({}: {
  versions: string[];
  defaultVersion: string;
}) {
  const router = useRouter();
  return (
    <SidebarMenu onClick={() => router.push("/landing")} className="cursor-pointer mb-3 mt-3">
      <SidebarMenuItem>
        {/* Clickable logo container */}
        <div
          className="relative cursor-pointer group w-full flex items-center justify-start overflow-hidden"
          onClick={() => router.push("/")}
        >
          {/* Logo */}
          <NextImage
            src="/TIKLE_logo.svg"
            alt="TIKLE Logo"
            width={120}
            height={40}
            priority
            className="transition-all duration-500 group-hover:translate-x-10 group-hover:mx-2"
          />
          {/* Home Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2 w-8 h-8 opacity-0 scale-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
          >
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}