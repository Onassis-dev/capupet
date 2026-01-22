import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { createPetSchema } from "@server/routes/pets/pets.schema";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { useState } from "react";
import {
  SexOptions,
  SpeciesOptions,
  StatusOptions,
} from "@/components/select-options";

const defaultValues = {
  name: "",
  species: undefined,
  sex: undefined,
  status: undefined,
};

export const PetsForm = () => {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);

  const t = useI18n({
    registerPet: {
      es: "Registrar mascota",
      en: "Register pet",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    species: {
      es: "Especie",
      en: "Species",
    },
    sex: {
      es: "Sexo",
      en: "Sex",
    },
    admissionDate: {
      es: "Fecha de ingreso",
      en: "Admission date",
    },
    petRegistered: {
      es: "Mascota registrada",
      en: "Pet registered",
    },
    status: {
      es: "Status",
      en: "Estatus",
    },
  });

  const petsForm = useForm<z.infer<typeof createPetSchema>>({
    resolver: zodResolver(createPetSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof createPetSchema>
    ) {
      await get(api.pets.$post({ json: values }));

      showSuccess(t("petRegistered"));
      client.invalidateQueries({ queryKey: ["pets"] });
      petsForm.reset(defaultValues);
      setOpen(false);
    },
  });

  const submit = petsForm.handleSubmit(
    (values: z.infer<typeof createPetSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={t("registerPet")}
      trigger={t("registerPet")}
      submit={submit}
      isPending={isPending}
      reset={() => petsForm.reset(defaultValues)}
    >
      <Form {...petsForm}>
        <form onSubmit={submit}>
          <FormField
            control={petsForm.control}
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
            control={petsForm.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("species")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SpeciesOptions />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petsForm.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sex")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SexOptions />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={petsForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <StatusOptions />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ModalForm>
  );
};
