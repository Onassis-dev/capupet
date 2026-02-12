import { Button } from "@workspace/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";
import { resetPasswordSchema, useResetPasswordSchema } from "./auth.models";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import z from "zod/v4";
import { showError, showSuccess } from "@/lib/toast";
import { useI18n } from "@/hooks/use-i18n";
import { useNavigate, Link } from "react-router";

export default function ForgotPasswordPage() {
  const t = useI18n({
    resetPassword: {
      es: "Restablecer contraseña",
      en: "Reset password",
    },
    email: {
      es: "Correo electrónico",
      en: "Email",
    },
    sendEmail: {
      es: "Enviar correo",
      en: "Send email",
    },
    resetLinkSent: {
      es: "Te hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico.",
      en: "We have sent you a link to reset your password to your email.",
    },
    resetError: {
      es: "Hubo un problema al enviar el correo de restablecimiento.",
      en: "There was a problem sending the reset email.",
    },
    rememberPassword: {
      es: "¿Recordaste tu contraseña?",
      en: "Remember your password?",
    },
    login: {
      es: "Iniciar sesión",
      en: "Login",
    },
    noAccount: {
      es: "¿No tienes una cuenta?",
      en: "Don't have an account?",
    },
    register: {
      es: "Regístrate",
      en: "Register",
    },
  });
  const navigate = useNavigate();
  const resetPasswordForm = useResetPasswordSchema();

  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: window.location.origin + "/reset-password",
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: () => {
      showSuccess(t("resetLinkSent"));
      navigate("/signin");
    },
    onError: (error: Error) => {
      showError(error.message || t("resetError"));
    },
  });

  return (
    <div className="w-full max-w-sm mt-12 sm:mt-32">
      <CardHeader>
        <CardTitle className="text-center mb-6">{t("resetPassword")}</CardTitle>
      </CardHeader>
      <Card>
        <CardContent>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit((v) => mutate(v))}>
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                {t("sendEmail")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center mt-6 space-y-2">
        <p>
          {t("rememberPassword")}{" "}
          <Link
            to={"/signin" + window.location.search}
            className="text-orange-500"
          >
            {t("login")}
          </Link>
        </p>
        <p>
          {t("noAccount")}{" "}
          <Link
            to={"/signup" + window.location.search}
            className="text-orange-500"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
