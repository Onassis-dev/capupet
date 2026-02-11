import { Outlet } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { Toaster } from "sonner";
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { z } from "zod/v4";
import { en, es } from "zod/v4/locales";

export default function RootLayout() {
  const { language } = useLanguage();

  const t = useI18n({
    required: {
      es: "requerido",
      en: "Required",
    },
    tooSmall: {
      es: "El texto debe tener al menos",
      en: "The text must be at least",
    },
    characters: {
      es: "caracteres",
      en: "characters",
    },
  });

  if (language === "es") z.config(es());
  if (language === "en") z.config(en());

  z.config({
    customError: (iss) => {
      if (iss.minimum === 1 || iss.code === "invalid_value")
        return t("required");
      else if (iss.code === "too_small")
        return `${t("tooSmall")} ${iss.minimum} ${t("characters")}`;
      else return iss.message;
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
