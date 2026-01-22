import { session } from "@/hooks/use-session";
import { Check, ChevronsUpDown, LogOutIcon, PlusIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { CreateOrganization } from "./CreateOrg";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, get } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/ui/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import { Logout } from "./Logout";

export function SelectOrganization() {
  const t = useI18n({
    configuration: {
      es: "Configuración",
      en: "Configuration",
    },
    inviteMembers: {
      es: "Invitar miembros",
      en: "Invite members",
    },
    registerOrganization: {
      es: "Registrar organización",
      en: "Register organization",
    },
    logout: {
      es: "Cerrar sesión",
      en: "Logout",
    },
  });
  const client = useQueryClient();
  const [openOrganization, setOpenOrganization] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (orgId: number) => {
      await get(api.users.org.$put({ json: { orgId } }));
      client.resetQueries();
      navigate("/dashboard");
    },
  });

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="grid grid-cols-[1.5rem_1fr_1rem] gap-2 p-2 rounded-lg items-center cursor-pointer mb-4">
          <Avatar className="rounded-lg size-6">
            <AvatarImage />

            <AvatarFallback>{session?.user?.orgName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-start flex flex-col gap-1 text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[17ch] text-foreground">
            {session?.user?.orgName}
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div
            className={cn(
              "border-b p-3 grid grid-cols-[1.5rem_1fr] grid-rows-[auto_auto] gap-2 items-center",
              (!session?.user?.owner || !session?.user?.users) && "gap-y-0"
            )}
          >
            <Avatar className="rounded-lg size-6">
              <AvatarImage src={session?.user?.orgLogo || ""} />

              <AvatarFallback>{session?.user?.orgName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap block">
                {session?.user?.orgName}
              </span>
            </div>
            <div className="flex gap-2 col-span-2">
              {session?.user?.owner && (
                <Button
                  variant="secondary"
                  className="text-xs h-auto px-1.5 py-1"
                  onClick={() => {
                    navigate("/settings/organization");
                    setOpen(false);
                  }}
                >
                  {t("configuration")}
                </Button>
              )}
              {session?.user?.users && (
                <Button
                  variant="secondary"
                  className="text-xs h-auto px-1.5 py-1"
                  onClick={() => {
                    navigate("/settings/users");
                    setOpen(false);
                  }}
                >
                  {t("inviteMembers")}
                </Button>
              )}
            </div>
          </div>

          <div className="p-2 border-b">
            {session?.orgs?.map((org) => (
              <Button
                key={org.id}
                onClick={() => {
                  mutate(org.id);
                  setOpen(false);
                }}
                variant="ghost"
                className="w-full font-medium text-sm h-auto p-1 grid grid-cols-[1.5rem_1fr_1rem] gap-2 text-left"
              >
                <Avatar className="rounded-lg size-6">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-foreground">
                    {org.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap block">
                  {org.name}
                </span>
                {session?.user?.organizationId === org.id && (
                  <Check className="ml-auto size-4" />
                )}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full font-medium text-sm h-auto p-1 text-sidebar-primary-foreground grid grid-cols-[1.5rem_1fr] gap-2 text-left"
              onClick={() => setOpenOrganization(true)}
            >
              <PlusIcon className="size-4 mx-auto" />
              {t("registerOrganization")}
            </Button>
          </div>
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full font-medium text-sm h-auto p-1 grid grid-cols-[1.5rem_1fr] gap-2 text-left text-muted-foreground"
              onClick={() => setOpenLogout(true)}
            >
              <LogOutIcon className="size-4 mx-auto" />
              {t("logout")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <CreateOrganization
        open={openOrganization}
        setOpen={setOpenOrganization}
      />
      <Logout open={openLogout} setOpen={setOpenLogout} />
    </>
  );
}
