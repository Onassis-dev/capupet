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
      <SelectOrganization />

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={true}>
              <Link href="/dashboard">
                <Home className="!size-5" strokeWidth={1.8} />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/pets">
                  <PawPrint className="!size-5" strokeWidth={1.8} />
                  <span>Pets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.adopters && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/adopters">
                  <Users className="!size-5" strokeWidth={1.8} />
                  <span>Adopters</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.tasks && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/tasks">
                  <CircleCheckBig className="!size-5" strokeWidth={1.8} />
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
