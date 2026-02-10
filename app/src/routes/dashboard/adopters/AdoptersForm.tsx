import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { adopterSchema } from "@server/routes/adopters/adopters.schema";
import { Textarea } from "@workspace/ui/components/ui/textarea";

interface props {
  adopter: Record<string, unknown> | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedAdopter: (adopter: Record<string, unknown> | null) => void;
}

const defaultValues: z.infer<typeof adopterSchema> = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

export const AdoptersForm = ({
  adopter,
  open,
  setOpen,
  setSelectedAdopter,
}: props) => {
  const client = useQueryClient();

  const t = useI18n({
    registerAdopter: {
      es: "Registrar adoptante",
      en: "Register adopter",
    },
    editAdopter: {
      es: "Editar adoptante",
      en: "Edit adopter",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    phone: {
      es: "Teléfono",
      en: "Phone",
    },
    email: {
      es: "Correo",
      en: "Email",
    },
    address: {
      es: "Dirección",
      en: "Address",
    },
    notes: {
      es: "Notas",
      en: "Notes",
    },
  });

  const adoptersForm = useForm<z.infer<typeof adopterSchema>>({
    resolver: zodResolver(adopterSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(values: z.infer<typeof adopterSchema>) {
      if (adopter)
        await get(
          api.adopters.$put({ json: { ...values, id: Number(adopter.id) } })
        );
      else await get(api.adopters.$post({ json: values }));

      client.invalidateQueries({ queryKey: ["adopters"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    adoptersForm.reset(adopter || defaultValues);
  }, [adopter, adoptersForm]);

  const submit = adoptersForm.handleSubmit(
    (values: z.infer<typeof adopterSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={adopter ? t("editAdopter") : t("registerAdopter")}
      trigger={t("registerAdopter")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedAdopter(null)}
    >
      <Form {...adoptersForm}>
        <form onSubmit={submit}>
          <FormField
            control={adoptersForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={adoptersForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={adoptersForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={adoptersForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("address")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={adoptersForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("notes")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ModalForm>
  );
};
