import { Button } from "@workspace/ui/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { AlertCircleIcon } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

function ErrorViewUI({
  title,
  message,
  buttonText,
  onGoHome,
}: {
  title: string;
  message?: string | null;
  buttonText: string;
  onGoHome: () => void;
}) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-sm flex flex-col items-center gap-4">
        <AlertCircleIcon
          className="size-12 text-destructive"
          strokeWidth={1.5}
        />
        <h1 className="text-2xl font-semibold">{title}</h1>
        {message && <p className="text-muted-foreground text-sm">{message}</p>}
        <Button onClick={onGoHome}>{buttonText}</Button>
      </div>
    </main>
  );
}

export default function ErrorView() {
  const error = useRouteError();
  const navigate = useNavigate();

  const t = useI18n({
    somethingWentWrong: {
      es: "Algo salió mal",
      en: "Something went wrong",
    },
    notFound: {
      es: "Página no encontrada",
      en: "Page not found",
    },
    goHome: {
      es: "Ir al inicio",
      en: "Go home",
    },
  });

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const title = isNotFound ? t("notFound") : t("somethingWentWrong");
  const message =
    isRouteErrorResponse(error) && error.data
      ? String(error.data)
      : error instanceof Error
        ? error.message
        : null;

  return (
    <ErrorViewUI
      title={title}
      message={message}
      buttonText={t("goHome")}
      onGoHome={() => navigate("/dashboard")}
    />
  );
}

export function ErrorFallback({
  error,
  onReset,
}: {
  error: unknown;
  onReset: () => void;
}) {
  const navigate = useNavigate();

  const t = useI18n({
    somethingWentWrong: {
      es: "Algo salió mal",
      en: "Something went wrong",
    },
    goHome: {
      es: "Ir al inicio",
      en: "Go home",
    },
  });

  const message =
    error instanceof Error
      ? error.message
      : error != null
        ? String(error)
        : null;

  return (
    <ErrorViewUI
      title={t("somethingWentWrong")}
      message={message}
      buttonText={t("goHome")}
      onGoHome={() => {
        onReset();
        navigate("/dashboard");
      }}
    />
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();

  const t = useI18n({
    notFound: {
      es: "Página no encontrada",
      en: "Page not found",
    },
    goHome: {
      es: "Ir al inicio",
      en: "Go home",
    },
  });

  return (
    <ErrorViewUI
      title={t("notFound")}
      message={null}
      buttonText={t("goHome")}
      onGoHome={() => navigate("/dashboard")}
    />
  );
}
