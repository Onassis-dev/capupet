import { api, get } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { petGeneralInfoSchema } from "@server/routes/pets/pets.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { showSuccess } from "@/lib/toast";
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { SubmitButton } from "@/components/ui/custom-buttons";
import { Textarea } from "@/components/ui/textarea";
import {
  MeasurementOptions,
  SexOptions,
  SpeciesOptions,
  StatusOptions,
} from "@/components/ui/select-options";
import { SizeOptions } from "@/components/ui/select-options";
import { PetGeneralInfo } from "./queries";
import { useEffect, useRef } from "react";

export const GeneralInfo = ({ data }: { data: PetGeneralInfo }) => {
  const { language } = useLanguage();
  const t = useI18n({
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
    savedInfo: {
      es: "Información guardada",
      en: "Info saved",
    },
    admissionDate: {
      es: "Fecha de ingreso",
      en: "Admission date",
    },
    bornDate: {
      es: "Fecha de nacimiento",
      en: "Birth date",
    },
    size: {
      es: "Tamaño",
      en: "Size",
    },
    weight: {
      es: "Peso",
      en: "Weight",
    },
    measurement: {
      es: "Unidad",
      en: "Unit",
    },
    comments: {
      es: "Comentarios",
      en: "Comments",
    },
    status: {
      es: "Estado",
      en: "Status",
    },
    saveChanges: {
      es: "Guardar cambios",
      en: "Save changes",
    },
  });
  const client = useQueryClient();
  const initiated = useRef(false);

  const petsForm = useForm<z.infer<typeof petGeneralInfoSchema>>({
    resolver: zodResolver(petGeneralInfoSchema),
    defaultValues: {
      id: 0,
      name: "",
      species: undefined,
      sex: undefined,
      admissionDate: undefined,
      bornDate: undefined,
      size: undefined,
      weight: undefined,
      measurement: undefined,
      comments: undefined,
      status: undefined,
    },
  });

  useEffect(() => {
    if (!initiated.current && data) {
      petsForm.reset(data);
      initiated.current = true;
    }
  }, [data, petsForm]);

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof petGeneralInfoSchema>
    ) {
      await get(api.pets.general.$put({ json: values }));
      showSuccess(t("savedInfo"));
      client.invalidateQueries({ queryKey: ["pets"] });
    },
  });

  const submit = petsForm.handleSubmit(
    (values: z.infer<typeof petGeneralInfoSchema>) => mutate(values)
  );

  return (
    <Form {...petsForm}>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("status")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value}
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
        <FormField
          control={petsForm.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sex")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value}
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
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("species")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value}
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
          name="admissionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admissionDate")}</FormLabel>
              <FormControl>
                <DatePicker field={field} locale={language} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={petsForm.control}
          name="bornDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bornDate")}</FormLabel>
              <FormControl>
                <DatePicker field={field} locale={language} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={petsForm.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("size")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SizeOptions />
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={petsForm.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("weight")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petsForm.control}
            name="measurement"
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>{t("measurement")}</FormLabel>
                <Select
                  key={field.value}
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <MeasurementOptions />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={petsForm.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{t("comments")}</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-24"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <SubmitButton disabled={isPending}>{t("saveChanges")}</SubmitButton>
        </div>
      </form>
    </Form>
  );
};
