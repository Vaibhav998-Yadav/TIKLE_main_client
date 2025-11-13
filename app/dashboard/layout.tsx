"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, type ReactNode } from "react";
import TailwindSkeleton from "@/components/ui/tailwind_skeleton";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBDCMeta } from "@/app/redux/slices/bdcMetaSlice";
import { fetchNotifications } from "@/app/redux/slices/notificationsSlice";
import Notification_bell from "../assets/svgs/Notification_bell";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  const { data: bdcData, status: bdcStatus } = useAppSelector(
    (state) => state.bdcMeta
  );
  const { data: notifications } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (bdcData === null) {
      dispatch(fetchBDCMeta("0001287750"));
    }
    dispatch(fetchNotifications());
  }, [dispatch, bdcData]);

  const isLoading = bdcStatus === "loading" || bdcStatus === "idle";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">TIKLE</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div style={{ width: "90%" }}></div>
          <Link href="/dashboard/notifications">
            <div style={{ marginRight: "10px", cursor: "pointer" }}>
              <Notification_bell notifications={notifications.length} />
            </div>
          </Link>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </header>
        <main className="flex flex-1 flex-col">
          {isLoading ? <TailwindSkeleton /> : children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}