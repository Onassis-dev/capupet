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
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRegisterSchema } from "../auth.models";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { showError } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function Page() {
  const t = useI18n({
    register: {
      es: "Registrarse",
      en: "Register",
    },
    continueWithGoogle: {
      es: "Continuar con Google",
      en: "Continue with Google",
    },
    orUseEmail: {
      es: "O usa tu correo",
      en: "Or use your email",
    },
    username: {
      es: "Nombre de usuario",
      en: "Username",
    },
    enterUsername: {
      es: "Introduce tu nombre de usuario",
      en: "Enter your username",
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
    haveAccount: {
      es: "¿Ya tienes una cuenta?",
      en: "Already have an account?",
    },
    signIn: {
      es: "Iniciar sesión",
      en: "Sign in",
    },
    byRegistering: {
      es: "Al registrarte, aceptas los",
      en: "By registering, you accept the",
    },
    termsAndConditions: {
      es: "términos y condiciones",
      en: "terms and conditions",
    },
    and: {
      es: "y",
      en: "and",
    },
    privacyPolicy: {
      es: "la política de privacidad",
      en: "privacy policy",
    },
    emailInUse: {
      es: "El correo electrónico ya está en uso",
      en: "The email is already in use",
    },
  });
  const router = useRouter();
  const { language } = useLanguage();

  const handleSignup = async (values: any) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.username,
      callbackURL: window.location.origin + "/verify-email",
      lang: language,
      theme: "light",
    });

    if (error) {
      if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")
        return showError(t("emailInUse"));
      return showError(error.message);
    }
    router.push("/verify-email");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSignup,
  });

  const registerForm = useRegisterSchema();

  return (
    <>
      <div className="w-full max-w-sm">
        <CardHeader className="pb-0 space-y-1 mb-6">
          <CardTitle className="text-center text-2xl font-semibold">
            {t("register")}
          </CardTitle>
        </CardHeader>
        <Card className="mx-2">
          <CardContent>
            <Button
              variant={"outline"}
              className="w-full flex gap-3"
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
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit((v) => mutate(v))}>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("enterUsername")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
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
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
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

                <Button className="w-full" type="submit" loading={isPending}>
                  {t("register")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-center mt-6">
        {t("haveAccount")}{" "}
        <Link href="/signin" className="text-blue">
          {t("signIn")}
        </Link>
      </p>

      <p className="text-[13px] opacity-60 text-center max-w-xs w-full">
        {t("byRegistering")}{" "}
        <a target="_blank" className="underline" href="/terms">
          {t("termsAndConditions")}
        </a>{" "}
        {t("and")}{" "}
        <a target="_blank" className="underline" href="/privacy">
          {t("privacyPolicy")}
        </a>
        .
      </p>
    </>
  );
}
