"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/ui/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { newPasswordSchema, useNewPasswordSchema } from "../auth.models";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import z from "zod/v4";
import { showError, showSuccess } from "@/lib/toast";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm mt-12 sm:mt-32" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const t = useI18n({
    passwordMinLength: {
      es: "La contraseña debe tener al menos 8 caracteres",
      en: "Password must be at least 8 characters",
    },
    passwordsDoNotMatch: {
      es: "Las contraseñas no coinciden",
      en: "Passwords do not match",
    },
    resetTokenNotFound: {
      es: "Token de restablecimiento no encontrado",
      en: "Reset token not found",
    },
    passwordResetSuccess: {
      es: "Tu contraseña ha sido restablecida exitosamente.",
      en: "Your password has been reset successfully.",
    },
    passwordResetError: {
      es: "Hubo un problema al restablecer tu contraseña.",
      en: "There was a problem resetting your password.",
    },
    invalidToken: {
      es: "Token inválido",
      en: "Invalid token",
    },
    requestNewLink: {
      es: "Solicitar nuevo enlace",
      en: "Request new link",
    },
    backToLogin: {
      es: "Volver al inicio de sesión",
      en: "Back to login",
    },
    resetPassword: {
      es: "Restablecer contraseña",
      en: "Reset password",
    },
    newPassword: {
      es: "Nueva contraseña",
      en: "New password",
    },
    enterNewPassword: {
      es: "Introduce tu nueva contraseña",
      en: "Enter your new password",
    },
    confirmPassword: {
      es: "Confirmar contraseña",
      en: "Confirm password",
    },
    confirmNewPassword: {
      es: "Confirma tu nueva contraseña",
      en: "Confirm your new password",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordForm = useNewPasswordSchema();

  const handleResetPassword = async (
    values: z.infer<typeof newPasswordSchema>
  ) => {
    if (!token) {
      throw new Error(t("resetTokenNotFound"));
    }

    await authClient.resetPassword({
      newPassword: values.password,
      token: token,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: () => {
      showSuccess(t("passwordResetSuccess"));
      router.push("/signin");
    },
    onError: (error: Error) => {
      showError(error.message || t("passwordResetError"));
    },
  });

  if (!token) {
    return (
      <div className="w-full max-w-sm mt-12 sm:mt-32 flex flex-col items-center gap-4">
        <CardHeader className="pb-0 space-y-1">
          <CardTitle className="text-center text-2xl mb-6">
            {t("invalidToken")}
          </CardTitle>
        </CardHeader>
        <Button asChild className="w-64">
          <Link href="/forgot-password" className="text-blue">
            {t("requestNewLink")}
          </Link>
        </Button>
        <div className="text-sm text-center space-y-2">
          <p>
            <Link href="/signin" className="text-blue">
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPassword")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder={t("enterNewPassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword")}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder={t("confirmNewPassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                {t("resetPassword")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-sm text-center mt-6 space-y-2">
        <p>
          <Link href="/signin" className="text-blue">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
