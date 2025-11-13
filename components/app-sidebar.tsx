"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// --------------------
// Types
// --------------------
type NavItem = {
  title: string;
  url?: string; // optional, because some items are only collapsible headers
  items?: NavItem[]; // recursive: allows unlimited nesting
};

// --------------------
// Example data
// --------------------
const data: {
  versions: string[];
  navMain: NavItem[];
} = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Company Published Docs",
      url: "/dashboard/view-filings",
      
    },
    {
      title: "Financial Statements",
      url: "/dashboard/financial-statements",
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
    },
    {
      title: "Pdf to Image Converter",
      url: "/dashboard/pdf-to-image",
    },
  ],
};

// --------------------
// Recursive Renderer
// --------------------
function RenderNavItems({
  items,
  pathname,
  level = 0,
}: {
  items: NavItem[];
  pathname: string;
  level?: number;
}) {
  return (
    <SidebarMenu>
      {items.map((item) =>
        item.items && item.items.length > 0 ? (
          <Collapsible key={item.title} defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger
                className={`
                  flex w-full items-center justify-between rounded-md 
                  px-3 py-2 text-sm text-white transition-colors
                  hover:bg-[#4f5467] hover:text-white
                `}
                style={{
                  paddingLeft: `${16 + level * 16}px`,
                  height: "36px",
                }}
              >
                <span>{item.title}</span>
                <ChevronRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <RenderNavItems
                  items={item.items}
                  pathname={pathname}
                  level={level + 1}
                />
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
              className="flex w-full items-center rounded-md text-sm text-white transition-colors hover:bg-[#4f5467] hover:text-white"
              style={{
                paddingLeft: `${16 + level * 16}px`,
                height: "36px",
              }}
            >
              <Link href={item.url!}>{item.title}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  );
}


// --------------------
// Main Component
// --------------------
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props} className="px-2">
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#081027" }} />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header with Version Switcher */}
        <SidebarHeader>
          <VersionSwitcher
            versions={data.versions}
            defaultVersion={data.versions[0]}
          />
        </SidebarHeader>

        {/* Recursive Navigation */}
        <SidebarContent className="gap-0">
          <RenderNavItems items={data.navMain} pathname={pathname} />
        </SidebarContent>

        {/* Footer (optional) */}
        <SidebarFooter className="border-t border-white/20">
          {/* <UserProfileSection /> */}
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
