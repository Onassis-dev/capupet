import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";
import { Separator } from "@workspace/ui/components/ui/separator";
import { useI18n } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth-client";
import { Link } from "react-router";
import { Input } from "@workspace/ui/components/ui/input";
import PasswordInput from "@/components/password-input";
import { showError } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import z from "zod/v4";
import { LoginSchema, useLoginSchema } from "./auth.models";

export default function SignInPage() {
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
    password: {
      es: "Contraseña",
      en: "Password",
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
        callbackURL: window.location.origin + "/",
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
        <CardTitle className="text-center">{t("welcomeBack")}</CardTitle>
      </CardHeader>
      <Card className="mx-2">
        <CardContent>
          <Button
            variant={"outline"}
            className="w-full flex gap-2"
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + "/",
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
                      <Input {...field} />
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
                        to="/forgot-password"
                        className="cursor-pointer text-sm text-right font-medium"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} />
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
      <p className="text-center mt-6">
        {t("noAccount")}{" "}
        <Link to="/signup" className="text-orange-500">
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
