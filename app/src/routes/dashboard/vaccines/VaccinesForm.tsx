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
import { vaccineSchema } from "@server/routes/vaccines/vaccines.schema";
import { Textarea } from "@workspace/ui/components/ui/textarea";

interface props {
  vaccine: Record<string, unknown> | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedVaccine: (vaccine: Record<string, unknown> | null) => void;
}

const defaultValues: z.infer<typeof vaccineSchema> = {
  id: 0,
  name: "",
  description: "",
};

export const VaccinesForm = ({
  vaccine,
  open,
  setOpen,
  setSelectedVaccine,
}: props) => {
  const client = useQueryClient();

  const t = useI18n({
    registerVaccine: {
      es: "Registrar vacuna",
      en: "Register vaccine",
    },
    editVaccine: {
      es: "Editar vacuna",
      en: "Edit vaccine",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    description: {
      es: "Descripción",
      en: "Description",
    },
  });

  const vaccinesForm = useForm<z.infer<typeof vaccineSchema>>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(values: z.infer<typeof vaccineSchema>) {
      if (vaccine)
        await get(
          api.vaccines.$put({ json: { ...values, id: Number(vaccine.id) } })
        );
      else await get(api.vaccines.$post({ json: values }));

      client.invalidateQueries({ queryKey: ["vaccines"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    vaccinesForm.reset(vaccine || defaultValues);
  }, [vaccine, vaccinesForm]);

  const submit = vaccinesForm.handleSubmit(
    (values: z.infer<typeof vaccineSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={vaccine ? t("editVaccine") : t("registerVaccine")}
      trigger={t("registerVaccine")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedVaccine(null)}
    >
      <Form {...vaccinesForm}>
        <form onSubmit={submit}>
          <FormField
            control={vaccinesForm.control}
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
            control={vaccinesForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
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
