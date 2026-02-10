import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, get } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { showSuccess } from "@/lib/toast";
import z from "zod/v4";
import { SubmitButton } from "@/components/custom-buttons";
import { useI18n } from "@/hooks/use-i18n";
import { LanguageOptions } from "@/components/select-options";
import { updateUserSchema } from "@server/routes/users/user.schema";

type UserForm = z.infer<typeof updateUserSchema>;

export function Account() {
  const { session: sessionData } = useSession();
  const queryClient = useQueryClient();

  const t = useI18n({
    save: {
      es: "Guardar",
      en: "Save",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    nameDescription: {
      es: "Nombre que verán otros usuarios",
      en: "Name other users will see",
    },
    language: {
      es: "Idioma",
      en: "Language",
    },
    languageDescription: {
      es: "Idioma de la interfaz para este usuario",
      en: "Interface language for this user",
    },
    email: {
      es: "Email",
      en: "Email",
    },
    emailDescription: {
      es: "Correo con el que registraste tu cuenta",
      en: "Email you registered your account with",
    },
    userUpdated: {
      es: "Cuenta actualizada",
      en: "Account updated",
    },
  });

  const form = useForm<UserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: sessionData?.user?.name ?? "",
      lang: sessionData?.user?.lang ?? "es",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: UserForm) => {
      await get(api.users.data.$put({ json: values }));
      showSuccess(t("userUpdated"));
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  const submit = form.handleSubmit((values: UserForm) => mutate(values));

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[1fr_16rem] border-b mb-6">
              <div>
                <FormLabel className="text-base">{t("name")}</FormLabel>
                <FormDescription>{t("nameDescription")}</FormDescription>
              </div>
              <FormControl>
                <Input value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <div />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lang"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[1fr_16rem] border-b mb-6">
              <div>
                <FormLabel className="text-base">{t("language")}</FormLabel>
                <FormDescription>{t("languageDescription")}</FormDescription>
              </div>
              <FormControl>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <LanguageOptions />
                </Select>
              </FormControl>
              <div />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="grid grid-cols-[1fr_16rem] border-b mb-6">
          <div>
            <FormLabel className="text-base">{t("email")}</FormLabel>
            <FormDescription>{t("emailDescription")}</FormDescription>
          </div>
          <FormControl>
            <Input readOnly value={sessionData?.user?.email ?? ""} />
          </FormControl>
          <div />
          <FormMessage />
        </FormItem>

        <div className="pt-4 sticky bottom-28">
          <SubmitButton className="w-full sm:w-auto" disabled={isPending}>
            {t("save")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
