import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrgSchema } from "@server/routes/organizations/organizations.schema";
import { api, get } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import { UploadIcon } from "lucide-react";
import z from "zod/v4";
import { SubmitButton } from "@/components/custom-buttons";
import { useI18n } from "@/hooks/use-i18n";

type OrgForm = z.infer<typeof updateOrgSchema>;

export function Organization() {
  const { session: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const displayImage = imagePreview || sessionData?.user?.orgLogo || null;

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
      es: "El nombre de la organización",
      en: "The name of the organization",
    },
    logo: {
      es: "Logo",
      en: "Logo",
    },
    logoDescription: {
      es: "El logo de la organización",
      en: "The logo of the organization",
    },
    organizationUpdated: {
      es: "Organización actualizada",
      en: "Organization updated",
    },
    remove: {
      es: "Eliminar",
      en: "Remove",
    },
  });

  const orgForm = useForm<OrgForm>({
    resolver: zodResolver(updateOrgSchema),
    defaultValues: {
      name: sessionData?.user?.orgName || "",
    },
    values: {
      name: sessionData?.user?.orgName || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: OrgForm) => {
      const data: { name: string; file?: File } = selectedFile
        ? { name: values.name, file: selectedFile }
        : { name: values.name };
      await get(api.organizations.$put({ form: data }));
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setSelectedFile(null);
    },
  });

  const submit = orgForm.handleSubmit((values: OrgForm) => {
    mutate({ ...values, file: selectedFile || undefined });
  });

  const { mutate: removeLogo, isPending: isRemovingLogo } = useMutation({
    mutationFn: async () => {
      await get(api.organizations.logo.$delete());
      setImagePreview(null);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  return (
    <Form {...orgForm}>
      <form onSubmit={submit} className="space-y-4">
        <FormItem className="grid sm:grid-cols-[1fr_16rem] border-b mb-6">
          <div>
            <FormLabel className="text-base">{t("logo")}</FormLabel>
            <FormDescription>{t("logoDescription")}</FormDescription>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2 sm:m-0">
            <button
              type="button"
              className="aspect-square rounded-xl border size-24 overflow-hidden"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex justify-center">
                  <UploadIcon className="size-4" />
                </div>
              )}
            </button>

            {displayImage && (
              <SubmitButton
                variant="secondary"
                onClick={() => removeLogo()}
                disabled={isRemovingLogo}
              >
                {t("remove")}
              </SubmitButton>
            )}
          </div>

          <div></div>
          <FormMessage />
        </FormItem>

        <FormField
          control={orgForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid sm:grid-cols-[1fr_16rem] border-b mb-6">
              <div>
                <FormLabel className="text-base">{t("name")}</FormLabel>
                <FormDescription>{t("nameDescription")}</FormDescription>
              </div>
              <FormControl className="mt-2">
                <Input value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <div></div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 sticky bottom-28">
          <SubmitButton className="w-full sm:w-auto" disabled={isPending}>
            {t("save")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
