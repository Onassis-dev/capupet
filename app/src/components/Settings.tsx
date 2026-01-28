import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrgSchema } from "@server/routes/organizations/organizations.schema";
import { api, get } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import { showSuccess } from "@/lib/toast";
import { UploadIcon } from "lucide-react";
import z from "zod/v4";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type OrgForm = z.infer<typeof updateOrgSchema>;

export function Settings({ open, setOpen }: props) {
  const { session: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const displayImage = imagePreview || sessionData?.user?.orgLogo || null;

  const t = useI18n({
    title: {
      es: "Configuración",
      en: "Settings",
    },
    close: {
      es: "Cerrar",
      en: "Close",
    },
    save: {
      es: "Guardar",
      en: "Save",
    },
    organization: {
      es: "Organización",
      en: "Organization",
    },
    account: {
      es: "Cuenta",
      en: "Account",
    },
    users: {
      es: "Usuarios",
      en: "Users",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    logo: {
      es: "Logo",
      en: "Logo",
    },
    organizationUpdated: {
      es: "Organización actualizada",
      en: "Organization updated",
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
      const data = {
        name: values.name,
      };
      if (values.file) data.file = values.file;
      await get(api.organizations.$put({ form: data }));
      showSuccess(t("organizationUpdated"));
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setSelectedFile(null);
    },
  });

  const submit = orgForm.handleSubmit((values: OrgForm) => {
    mutate({ ...values, file: selectedFile || undefined });
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-full sm:max-w-lg h-screen sm:h-auto  grid-rows-[auto_1fr] rounded-none sm:rounded-3xl p-0"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="org" className="">
          <TabsList className="mb-6 w-full text-sm sm:text-base flex justify-start gap-2 mt-6">
            <TabsTrigger className="ml-6 flex-none" value="org">
              {t("organization")}
            </TabsTrigger>
            <TabsTrigger className="flex-none" value="account">
              {t("account")}
            </TabsTrigger>
            <TabsTrigger className="mr-6 flex-none" value="users">
              {t("users")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="org" className="px-6">
            <Form {...orgForm}>
              <form onSubmit={submit} className="space-y-4">
                <FormField
                  control={orgForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>{t("logo")}</FormLabel>
                  <FormControl>
                    <button
                      type="button"
                      className="w-full aspect-square rounded-lg border flex items-center justify-center flex-col gap-1 p-2 text-center relative overflow-hidden"
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
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <UploadIcon className="size-4" />
                          <span className="text-sm">{t("logo")}</span>
                        </>
                      )}
                    </button>
                  </FormControl>
                </FormItem>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="overflow-y-auto p-6 flex flex-col h-full">
          <DialogFooter className="mt-auto">
            <Button asChild variant="secondary" className="hidden sm:flex">
              <DialogClose>{t("close")}</DialogClose>
            </Button>
            <Button
              onClick={submit}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
