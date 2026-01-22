import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { Button } from "@workspace/ui/components/ui/button";

type props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Logout = ({ setOpen, open }: props) => {
  const t = useI18n({
    logout: {
      es: "Cerrar sesión",
      en: "Logout",
    },
    logoutDescription: {
      es: "¿Estás seguro de querer cerrar sesión?",
      en: "Are you sure you want to logout?",
    },
    cancel: {
      es: "Cancelar",
      en: "Cancel",
    },
    confirm: {
      es: "Confirmar",
      en: "Confirm",
    },
  });
  const client = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      client.resetQueries();
      navigate("/signin");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("logout")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("logoutDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button onClick={() => mutate()} disabled={isPending}>
            {t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
