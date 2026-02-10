import { useParams } from "react-router";
import { api, get } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PetGeneralInfo } from "./queries";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { publicPetSchema } from "@server/routes/pets/pets.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { showSuccess } from "@/lib/toast";
import { useI18n } from "@/hooks/use-i18n";
import { SubmitButton } from "@/components/custom-buttons";
import { Textarea } from "@workspace/ui/components/ui/textarea";
import { Switch } from "@workspace/ui/components/ui/switch";
import { UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";

export const PublicInfo = ({ data }: { data: PetGeneralInfo }) => {
  const t = useI18n({
    deleteTitle: {
      es: "Eliminar imagen",
      en: "Delete image",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta imagen?",
      en: "Are you sure you want to delete this image?",
    },
    publicDescription: {
      es: "Descripción pública",
      en: "Public description",
    },
    public: {
      es: "Público",
      en: "Public",
    },
    saveChanges: {
      es: "Guardar cambios",
      en: "Save changes",
    },
    images: {
      es: "Imágenes",
      en: "Images",
    },
    uploadImage: {
      es: "Subir",
      en: "Upload",
    },
  });
  const { id } = useParams();
  const client = useQueryClient();

  const [isUploading, setIsUploading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const petsForm = useForm<z.infer<typeof publicPetSchema>>({
    resolver: zodResolver(publicPetSchema),
    values: data as z.infer<typeof publicPetSchema> | undefined,
    defaultValues: {
      id: 0,
      publicDescription: "",
      public: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof publicPetSchema>
    ) {
      await get(api.pets.public.$put({ json: values }));
      showSuccess(t("saveChanges"));
      client.invalidateQueries({ queryKey: ["pets"] });
    },
  });

  const submit = petsForm.handleSubmit(
    (values: z.infer<typeof publicPetSchema>) => mutate(values)
  );

  return (
    <>
      <div>
        <p className="text-sm font-bold">{t("images")}</p>

        <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 pt-1 pb-4">
          {data?.images?.map((image) => (
            <div key={image} className="relative">
              <img
                src={image}
                className="w-full aspect-square rounded-lg object-cover"
              />

              <button
                className="cursor-pointer absolute top-px right-px bg-destructive text-primary-foreground rounded-full p-1"
                onClick={() => {
                  setSelectedImage(image);
                  setOpenDelete(true);
                }}
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ))}

          {(data?.images?.length || 0) < 4 && (
            <>
              <button
                disabled={isUploading}
                className="w-full aspect-square rounded-lg border flex items-center justify-center flex-col gap-1 p-2 text-center"
                onClick={() => {
                  setIsUploading(true);
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file);
                      const data = await get(
                        api.images.$post({
                          form: {
                            petId: String(id),
                            file,
                          },
                        })
                      );

                      client.setQueryData(
                        ["pets", "general", id],
                        (old: Record<string, unknown>) => ({
                          ...old,
                          images: [...(old.images as string[]), data.url],
                        })
                      );
                      setIsUploading(false);
                    }
                  };
                  input.click();
                }}
              >
                <UploadIcon className="size-4" />
                <span className="text-sm">{t("uploadImage")}</span>
              </button>
            </>
          )}
        </div>
      </div>
      <Form {...petsForm}>
        <form onSubmit={submit} className="grid border-t pt-4 gap-x-4 gap-y-1">
          <FormField
            control={petsForm.control}
            name="publicDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("publicDescription")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none min-h-24"
                    {...field}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petsForm.control}
            name="public"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("public")}</FormLabel>
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

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteFunction={async () => {
          await get(api.images.$delete({ json: { url: selectedImage ?? "" } }));
          client.setQueryData(
            ["pets", "general", id],
            (old: Record<string, unknown>) => ({
              ...old,
              images: (old.images as string[])?.filter(
                (image) => image !== selectedImage
              ),
            })
          );
          setSelectedImage(null);
          setOpenDelete(false);
        }}
      />
    </>
  );
};
