"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, get } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { ChangeUrl } from "./changeUrl";
import { PageWrapper } from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { websiteSchema } from "@server/routes/websites/websites.schema";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { showSuccess } from "@/lib/toast";
import { Textarea } from "@/components/ui/textarea";
import { LanguageOptions } from "@/components/ui/select-options";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/ui/custom-buttons";
import { CreateWebsite } from "./CreateWebsite";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { PencilIcon, ShareIcon, SquareArrowOutUpRightIcon } from "lucide-react";

type Website = z.infer<typeof websiteSchema>;

export default function Page() {
  const t = useI18n({
    pageTitle: {
      es: "Sitio web",
      en: "Website",
    },
    websiteUpdated: {
      es: "Sitio web actualizado",
      en: "Website updated",
    },
    description: {
      es: "Descripción",
      en: "Description",
    },
    language: {
      es: "Idioma",
      en: "Language",
    },
    active: {
      es: "Activo",
      en: "Active",
    },
    saveChanges: {
      es: "Guardar cambios",
      en: "Save changes",
    },
    edit: {
      es: "Editar",
      en: "Edit",
    },
    visit: {
      es: "Visitar",
      en: "Visit",
    },
    share: {
      es: "Compartir",
      en: "Share",
    },
  });

  const [openEdit, setOpenEdit] = useState(false);

  const { data, status } = useQuery({
    queryKey: ["websites"],
    queryFn: () => get(api.websites.$get()),
  });

  const websitesForm = useForm<Website>({
    resolver: zodResolver(websiteSchema),
    values: data,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(values: Website) {
      await get(api.websites.$put({ json: values }));
      showSuccess(t("websiteUpdated"));
    },
  });

  const submit = websitesForm.handleSubmit((values: Website) => mutate(values));

  if (status === "success" && !data)
    return (
      <PageWrapper title={t("pageTitle")} size="sm">
        <CreateWebsite />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t("pageTitle")} size="sm">
      <ChangeUrl open={openEdit} setOpen={setOpenEdit} />

      <Form {...websitesForm}>
        <form onSubmit={submit} className="gap-4">
          <FormItem>
            <FormLabel>Url</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>capupet.com/</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput value={data?.url || ""} readOnly />
              </InputGroup>
            </FormControl>
            <div className="grid grid-cols-3 gap-2 pt-2 pb-6">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenEdit(true);
                }}
              >
                <PencilIcon className="size-4" />
                {t("edit")}
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    window.location.origin + "/" + data?.url,
                    "_blank"
                  );
                }}
              >
                <SquareArrowOutUpRightIcon className="size-4" />
                {t("visit")}
              </Button>
              <Button variant="secondary">
                <ShareIcon className="size-4" />
                {t("share")}
              </Button>
            </div>
          </FormItem>

          <FormField
            control={websitesForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none min-h-24"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={websitesForm.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("language")}</FormLabel>
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
                  <LanguageOptions />
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={websitesForm.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("active")}</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
    </PageWrapper>
  );
}
