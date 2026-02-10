import {
  AppWindowMacIcon,
  CircleCheckBig,
  Ellipsis,
  Home,
  PawPrint,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@workspace/ui/lib/utils";
import { SidebarTrigger } from "./sidebar";
import { session } from "@/hooks/use-session";

export function BottomNav() {
  const location = useLocation().pathname;
  const active = location.split("/")[1] || "";

  const t = useI18n({
    pets: { es: "Mascotas", en: "Pets" },
    website: { es: "Web", en: "Web" },
    tasks: { es: "Tareas", en: "Tasks" },
    more: { es: "Más", en: "More" },
    home: { es: "Inicio", en: "Home" },
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden flex items-center justify-around px-1 pt-4 pb-8">
      {session?.user?.pets && (
        <NavItem
          to="/pets"
          icon={<PawPrint className="size-5" strokeWidth={1.8} />}
          label={t("pets")}
          isActive={active === "pets"}
        />
      )}
      {session?.user?.website && (
        <NavItem
          to="/website"
          icon={<AppWindowMacIcon className="size-5" strokeWidth={1.8} />}
          label={t("website")}
          isActive={active === "website"}
        />
      )}
      {session?.user?.pets && (
        <NavItem
          to="/"
          icon={<Home className="size-5" strokeWidth={1.8} />}
          label={t("home")}
          isActive={active === ""}
        />
      )}
      {session?.user?.tasks && (
        <NavItem
          to="/tasks"
          icon={<CircleCheckBig className="size-5" strokeWidth={1.8} />}
          label={t("tasks")}
          isActive={active === "tasks"}
        />
      )}
      <SidebarTrigger>
        <Ellipsis className="size-5" strokeWidth={1.8} />
        <span className="text-sm">{t("more")}</span>
      </SidebarTrigger>
    </nav>
  );
}

function NavItem({
  to,
  icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-0.5 transition-colors py-1 px-2",
        isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
