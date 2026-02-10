import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { useEffect, useState } from "react";
import { showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { Textarea } from "@workspace/ui/components/ui/textarea";
import { useParams } from "react-router";
import { createMedicalSchema } from "@server/routes/medical/medical.schema";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/ui/select";
import type { medicalTypesArray } from "@server/db/medicalOptions";
import { MedicalOptionTypeOptions } from "@/components/select-options";

interface props {
  record: any | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedMedical: (record: any | null) => void;
  options:
    | {
        id: any;
        name: any;
        type: any;
      }[]
    | undefined;
}

const defaultValues = {
  medicalOptionId: 0,
  date: "",
  notes: "",
};

export const MedicalForm = ({
  record,
  open,
  setOpen,
  setSelectedMedical,
  options,
}: props) => {
  const client = useQueryClient();
  const { id } = useParams();
  const { language } = useLanguage();

  const t = useI18n({
    addRecord: {
      es: "Agregar registro médico",
      en: "Add medical record",
    },
    editRecord: {
      es: "Editar registro médico",
      en: "Edit medical record",
    },
    medicalOption: {
      es: "Opción médica",
      en: "Medical option",
    },
    date: {
      es: "Fecha",
      en: "Date",
    },
    notes: {
      es: "Notas",
      en: "Notes",
    },
    recordAdded: {
      es: "Registro médico agregado",
      en: "Medical record added",
    },
    recordUpdated: {
      es: "Registro médico actualizado",
      en: "Medical record updated",
    },
  });

  const medicalSchema = createMedicalSchema.omit({ petId: true });

  const medicalForm = useForm<z.infer<typeof medicalSchema>>({
    resolver: zodResolver(medicalSchema as any),
    defaultValues,
  });

  const [type, setType] =
    useState<(typeof medicalTypesArray)[number]>("vaccine");

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(values: z.infer<typeof medicalSchema>) {
      if (record) {
        await get(
          api.medical.$put({
            json: {
              id: record.id,
              ...values,
            },
          })
        );
        client.setQueryData(["medical", id], (old: Record<string, unknown>[]) =>
          old.map((r) => (r.id === record.id ? { ...r, ...values, type } : r))
        );
        showSuccess(t("recordUpdated"));
      } else {
        const newRecord = await get(
          api.medical.$post({
            json: {
              petId: Number(id),
              ...values,
            },
          })
        );
        client.setQueryData(
          ["medical", id],
          (old: Record<string, unknown>[]) => [
            { ...newRecord, ...values, type },
            ...old,
          ]
        );
        showSuccess(t("recordAdded"));
      }

      medicalForm.reset(defaultValues);
      setOpen(false);
    },
  });

  useEffect(() => {
    if (record) {
      // eslint-disable-next-line
      setType(record.type as any);
      medicalForm.reset({ ...record });
    } else {
      medicalForm.reset(defaultValues);
    }
  }, [record, medicalForm]);

  const submit = medicalForm.handleSubmit(
    (values: z.infer<typeof medicalSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={record ? t("editRecord") : t("addRecord")}
      trigger={t("addRecord")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedMedical(null)}
    >
      <Form {...medicalForm}>
        <form onSubmit={submit} className="space-y-4">
          <FormItem className="w-full">
            <FormLabel>{t("medicalOption")}</FormLabel>
            <FormControl>
              <Select
                onValueChange={(v) => {
                  setType(v as any);
                  medicalForm.setValue("medicalOptionId", undefined as any);
                }}
                value={type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <MedicalOptionTypeOptions />
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={medicalForm.control}
            name="medicalOptionId"
            render={({ field }) => (
              <>
                <FormItem className="w-full">
                  <FormLabel>{t("medicalOption")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options
                          ?.filter((option) => option.type === type)
                          .map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={medicalForm.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("date")}</FormLabel>
                <FormControl>
                  <DatePicker field={field} locale={language} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={medicalForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("notes")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    className="resize-none min-h-24"
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
