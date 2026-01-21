"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema, useResetPasswordSchema } from "../auth.models";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import z from "zod/v4";
import { showError, showSuccess } from "@/lib/toast";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const t = useI18n({
    resetPassword: {
      es: "Restablecer contraseña",
      en: "Reset password",
    },
    email: {
      es: "Correo electrónico",
      en: "Email",
    },
    enterEmail: {
      es: "Introduce tu correo electrónico",
      en: "Enter your email",
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
  const router = useRouter();
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
      router.push("/signin");
    },
    onError: (error: any) => {
      showError(error.message || t("resetError"));
    },
  });

  return (
    <div className="w-full max-w-sm mt-12 sm:mt-32">
      <CardHeader className="pb-0 space-y-1">
        <CardTitle className="text-center text-2xl mb-6">
          {t("resetPassword")}
        </CardTitle>
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
                      <Input
                        {...field}
                        placeholder={t("enterEmail")}
                        type="email"
                      />
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
      <div className="text-sm text-center mt-6 space-y-2">
        <p>
          {t("rememberPassword")}{" "}
          <Link href="/signin" className="text-blue">
            {t("login")}
          </Link>
        </p>
        <p>
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-blue">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
