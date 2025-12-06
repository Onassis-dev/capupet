"use client";

import * as React from "react";
import { CircleCheckBig, Home, PawPrint, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SelectOrganization } from "./SelectOrg";
import { session } from "@/hooks/use-session";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = usePathname();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <SelectOrganization />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(location, undefined)}>
              <Link href="/dashboard">
                <Home className="size-5!" strokeWidth={1.8} />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(location, "pets")}>
                <Link href="/dashboard/pets">
                  <PawPrint className="size-5!" strokeWidth={1.8} />
                  <span>Pets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.adopters && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(location, "adopters")}
              >
                <Link href="/dashboard/adopters">
                  <Users className="size-5!" strokeWidth={1.8} />
                  <span>Adopters</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.tasks && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(location, "tasks")}>
                <Link href="/dashboard/tasks">
                  <CircleCheckBig className="size-5!" strokeWidth={1.8} />
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

function isActive(location: string, tab?: string) {
  return location.split("/")[2] === tab;
}
