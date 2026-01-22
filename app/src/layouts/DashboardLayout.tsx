import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardWrapper } from "./DashboardWrapper";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardWrapper>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </DashboardWrapper>
    </SidebarProvider>
  );
}
