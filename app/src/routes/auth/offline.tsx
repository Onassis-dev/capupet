import { Button } from "@workspace/ui/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { WifiOffIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function OfflinePage() {
  const t = useI18n({
    noConnection: {
      es: "No hay conexión a internet",
      en: "No internet connection",
    },
    retry: {
      es: "Reintentar",
      en: "Retry",
    },
  });

  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <div className="text-center max-w-sm flex flex-col items-center gap-4">
        <WifiOffIcon
          className="size-12 text-muted-foreground"
          strokeWidth={1.5}
        />
        <h1 className="text-2xl">{t("noConnection")}</h1>
        <Button onClick={handleRetry}>{t("retry")}</Button>
      </div>
    </main>
  );
}
