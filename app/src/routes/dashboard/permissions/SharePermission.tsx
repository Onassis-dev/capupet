import Share from "@/components/Share";
import { useI18n } from "@/hooks/use-i18n";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { Input } from "@workspace/ui/components/ui/input";
import { Button } from "@workspace/ui/components/ui/button";
import { Share2Icon } from "lucide-react";

interface props {
  permission?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SharePermission = ({ permission, open, setOpen }: props) => {
  const t = useI18n({
    title: {
      es: "Compartir invitación",
      en: "Share invitation",
    },
    text: {
      es: "Comparte el link de la invitación con la persona que quieres añadir a tu organización.",
      en: "Share the invitation link with the person you want to add to your organization.",
    },
    share: {
      es: "Compartir",
      en: "Share",
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-4 sm:p-6"
        onOpenAutoFocus={(e: any) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("text")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={`${window.location.origin}/i/${permission?.invitation}`}
            readOnly
            className="text-sm"
          />

          <Share
            url={`${window.location.origin}/i/${permission?.invitation}`}
            title={t("title")}
          >
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
              <Share2Icon className="size-4 cursor-pointer" />
              {t("share")}
            </Button>
          </Share>
        </div>
      </DialogContent>
    </Dialog>
  );
};
