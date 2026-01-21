"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { showError } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import z from "zod/v4";
import { LoginSchema, useLoginSchema } from "../auth.models";

export default function Page() {
  const t = useI18n({
    welcomeBack: {
      es: "Bienvenido de vuelta",
      en: "Welcome back",
    },
    continueWithGoogle: {
      es: "Continuar con Google",
      en: "Continue with Google",
    },
    orUseEmail: {
      es: "O usa tu correo",
      en: "Or use your email",
    },
    email: {
      es: "Correo electrónico",
      en: "Email",
    },
    enterEmail: {
      es: "Introduce tu correo",
      en: "Enter your email",
    },
    password: {
      es: "Contraseña",
      en: "Password",
    },
    enterPassword: {
      es: "Introduce tu contraseña",
      en: "Enter your password",
    },
    forgotPassword: {
      es: "Olvidé mi contraseña",
      en: "Forgot my password",
    },
    signIn: {
      es: "Iniciar sesión",
      en: "Sign in",
    },
    noAccount: {
      es: "¿Aún no tienes una cuenta?",
      en: "Don't have an account?",
    },
    register: {
      es: "Regístrate",
      en: "Register",
    },
    invalidCredentials: {
      es: "Credenciales inválidas",
      en: "Invalid credentials",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof LoginSchema>) => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: window.location.origin + "/dashboard",
      });

      if (error) {
        if (error.code === "INVALID_EMAIL_OR_PASSWORD")
          return showError(t("invalidCredentials"));
        return showError(error.message);
      }
    },
  });

  const loginForm = useLoginSchema();

  return (
    <div className="w-full max-w-sm">
      <CardHeader className="pb-0 space-y-1 mb-6">
        <CardTitle className="text-center text-2xl font-semibold">
          {t("welcomeBack")}
        </CardTitle>
      </CardHeader>
      <Card className="mx-2">
        <CardContent>
          <Button
            variant={"outline"}
            className="w-full flex gap-2"
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + "/dashboard",
              });
            }}
          >
            <img src="/google.svg" alt="google" className="size-5" />
            {t("continueWithGoogle")}
          </Button>

          <Separator className="my-4">{t("orUseEmail")}</Separator>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit((v) => mutate(v))}>
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("enterEmail")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full flex justify-between">
                      {t("password")}
                      <Link
                        href="/forgot-password"
                        className="cursor-pointer text-sm text-right"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder={t("enterPassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                {t("signIn")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-sm text-center mt-6">
        {t("noAccount")}{" "}
        <Link href="/signup" className="text-blue">
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
