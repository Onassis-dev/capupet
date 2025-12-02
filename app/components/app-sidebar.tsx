"use client";

import * as React from "react";
import { CircleCheckBig, Home, PawPrint, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SelectOrganization } from "./SelectOrg";
import { session } from "@/hooks/use-session";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SelectOrganization />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Home />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/pets">
                  <PawPrint />
                  <span>Pets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.adopters && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/adopters">
                  <Users />
                  <span>Adopters</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.tasks && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/tasks">
                  <CircleCheckBig />
                  <span>Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
