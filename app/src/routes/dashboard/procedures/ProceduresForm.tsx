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
import { procedureSchema } from "@server/routes/procedures/procedures.schema";
import { Textarea } from "@workspace/ui/components/ui/textarea";

interface props {
  procedure: Record<string, unknown> | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedProcedure: (procedure: Record<string, unknown> | null) => void;
}

const defaultValues: z.infer<typeof procedureSchema> = {
  id: 0,
  name: "",
  description: "",
};

export const ProceduresForm = ({
  procedure,
  open,
  setOpen,
  setSelectedProcedure,
}: props) => {
  const client = useQueryClient();

  const t = useI18n({
    registerProcedure: {
      es: "Registrar procedimiento",
      en: "Register procedure",
    },
    editProcedure: {
      es: "Editar procedimiento",
      en: "Edit procedure",
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

  const proceduresForm = useForm<z.infer<typeof procedureSchema>>({
    resolver: zodResolver(procedureSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof procedureSchema>
    ) {
      if (procedure)
        await get(
          api.procedures.$put({ json: { ...values, id: Number(procedure.id) } })
        );
      else await get(api.procedures.$post({ json: values }));

      client.invalidateQueries({ queryKey: ["procedures"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    proceduresForm.reset(procedure || defaultValues);
  }, [procedure, proceduresForm]);

  const submit = proceduresForm.handleSubmit(
    (values: z.infer<typeof procedureSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={procedure ? t("editProcedure") : t("registerProcedure")}
      trigger={t("registerProcedure")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedProcedure(null)}
    >
      <Form {...proceduresForm}>
        <form onSubmit={submit}>
          <FormField
            control={proceduresForm.control}
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
            control={proceduresForm.control}
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
