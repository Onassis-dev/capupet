import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { RegisterButton, SubmitButton } from "@/components/custom-buttons";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  trigger?: string | React.ReactNode;
  submit: () => void;
  isPending: boolean;
  reset: () => void;
}

export const ModalForm = ({
  open,
  setOpen,
  children,
  title,
  trigger,
  submit,
  reset,
  isPending,
}: props) => {
  const t = useI18n({
    save: {
      es: "Guardar",
      en: "Save",
    },
    close: {
      es: "Cerrar",
      en: "Close",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {typeof trigger === "string" ? (
          <RegisterButton onClick={reset}>{trigger}</RegisterButton>
        ) : (
          trigger
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={true}
        className="max-w-full sm:max-w-md h-screen sm:h-auto  grid-rows-[auto_1fr] rounded-none sm:rounded-3xl p-0"
      >
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-left text-2xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col h-full">
          {children}

          <DialogFooter className="mt-auto">
            <Button asChild variant="secondary" className="hidden sm:flex">
              <DialogClose disabled={isPending}>{t("close")}</DialogClose>
            </Button>
            {submit && (
              <SubmitButton
                onClick={submit}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {t("save")}
              </SubmitButton>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
