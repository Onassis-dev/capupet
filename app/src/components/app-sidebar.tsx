import * as React from "react";
import {
  AppWindowMacIcon,
  CircleCheckBig,
  Home,
  PawPrint,
  Settings,
  Slice,
  Syringe,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar";
import { SelectOrganization } from "./SelectOrg";
import { session } from "@/hooks/use-session";
import { Link } from "react-router";
import { useLocation } from "react-router";
import { useI18n } from "@/hooks/use-i18n";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n({
    home: {
      es: "Inicio",
      en: "Home",
    },
    pets: {
      es: "Mascotas",
      en: "Pets",
    },
    adopters: {
      es: "Adoptantes",
      en: "Adopters",
    },
    vaccines: {
      es: "Vacunas",
      en: "Vaccines",
    },
    procedures: {
      es: "Procedimientos",
      en: "Procedures",
    },
    tasks: {
      es: "Tareas",
      en: "Tasks",
    },
    website: {
      es: "Sitio web",
      en: "Website",
    },
    settings: {
      es: "Configuración",
      en: "Settings",
    },
  });

  const location = useLocation().pathname;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <SelectOrganization />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(location, undefined)}>
              <Link to="/">
                <Home className="size-5!" strokeWidth={1.8} />
                <span>{t("home")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(location, "pets")}>
                <Link to="/pets">
                  <PawPrint className="size-5!" strokeWidth={1.8} />
                  <span>{t("pets")}</span>
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
                <Link to="/adopters">
                  <Users className="size-5!" strokeWidth={1.8} />
                  <span>{t("adopters")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(location, "vaccines")}
              >
                <Link to="/vaccines">
                  <Syringe className="size-5!" strokeWidth={1.8} />
                  <span>{t("vaccines")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.pets && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(location, "procedures")}
              >
                <Link to="/procedures">
                  <Slice className="size-5!" strokeWidth={1.8} />
                  <span>{t("procedures")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.tasks && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(location, "tasks")}>
                <Link to="/tasks">
                  <CircleCheckBig className="size-5!" strokeWidth={1.8} />
                  <span>{t("tasks")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {session?.user?.website && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(location, "website")}
              >
                <Link to="/website">
                  <AppWindowMacIcon className="size-5!" strokeWidth={1.8} />
                  <span>{t("website")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        <SidebarMenu className="mt-auto">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(location, "settings")}
            >
              <Link to="/settings">
                <Settings className="size-5!" strokeWidth={1.8} />
                <span>{t("settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function isActive(location: string, tab?: string) {
  return location.split("/")[1] === tab;
}
