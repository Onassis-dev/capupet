import { Button } from "@workspace/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api, get } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useI18n } from "@/hooks/use-i18n";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function VerifyEmailPage() {
  const t = useI18n({
    verifyEmail: {
      es: "Verifica tu correo",
      en: "Verify your email",
    },
    verificationLinkSent: {
      es: "Te hemos enviado un enlace de verificación a tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace de verificación para continuar.",
      en: "We have sent you a verification link to your email. Check your inbox and click the verification link to continue.",
    },
    sending: {
      es: "Enviando...",
      en: "Sending...",
    },
    resendIn: {
      es: "Reenviar en",
      en: "Resend in",
    },
    resendEmail: {
      es: "Reenviar correo",
      en: "Resend email",
    },
    backToLogin: {
      es: "Volver al inicio de sesión",
      en: "Back to login",
    },
  });
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);

  const { session } = useSession();

  function getSession() {
    return get(api.users.session.$get());
  }

  useQuery({
    queryKey: ["verify-email-check"],
    queryFn: async () => {
      const session = await getSession();
      if (session.user.verified) {
        queryClient.setQueryData(["session"], () => session);
        navigate(redirect);
      }
      return session;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const { mutate: resendEmail, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.sendVerificationEmail({
        email: session?.user.email || "",
        callbackURL:
          window.location.origin + "/verify-email?redirect=" + redirect,
      });
    },
    onSuccess: () => {
      setCooldown(30);
    },
  });

  const handleResendEmail = () => {
    if (cooldown === 0 && !isPending) {
      resendEmail();
    }
  };

  return (
    <div className="w-full max-w-sm mt-12 sm:mt-32 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("verifyEmail")}</CardTitle>
          <CardDescription className="text-center">
            {t("verificationLinkSent")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className=""
                onClick={handleResendEmail}
                disabled={cooldown > 0 || isPending}
              >
                {isPending
                  ? t("sending")
                  : cooldown > 0
                    ? `${t("resendIn")} ${cooldown}s`
                    : t("resendEmail")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button asChild className="w-64 mt-4 mx-auto" variant="ghost">
        <Link to="/signin">{t("backToLogin")}</Link>
      </Button>
    </div>
  );
}
