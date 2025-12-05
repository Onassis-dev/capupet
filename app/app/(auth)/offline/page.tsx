"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { WifiOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
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

  const router = useRouter();

  const handleRetry = () => {
    router.push("/dashboard");
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
