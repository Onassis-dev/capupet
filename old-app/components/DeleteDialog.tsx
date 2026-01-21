import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showSuccess } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/hooks/use-i18n";
import { Dispatch, SetStateAction } from "react";
import { SubmitButton } from "./ui/custom-buttons";

type props = {
  title: string;
  action: "delete" | "confirm";
  text: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  deleteFunction: () => Promise<unknown>;
  queryKey?: string;
};

const DeleteDialog = ({
  title,
  action,
  text,
  setOpen,
  open,
  successMessage,
  deleteFunction,
  queryKey,
}: props) => {
  const t = useI18n({
    delete: {
      es: "Eliminar",
      en: "Delete",
    },
    confirm: {
      es: "Confirmar",
      en: "Confirm",
    },
    cancel: {
      es: "Cancelar",
      en: "Cancel",
    },
  });
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteFunction();
      if (queryKey) client.invalidateQueries({ queryKey: [queryKey] });
      setOpen(false);
      showSuccess(successMessage);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <SubmitButton
            onClick={() => mutate()}
            variant={action === "delete" ? "destructive" : "default"}
            disabled={isPending}
          >
            {t(action)}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
