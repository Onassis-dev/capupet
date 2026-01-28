import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { api, get } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { ChangeUrl } from "./ChangeUrl";
import { PageWrapper } from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { websiteSchema } from "@server/routes/websites/websites.schema";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { showSuccess } from "@/lib/toast";
import { Textarea } from "@workspace/ui/components/ui/textarea";
import {
  ColorOptions,
  ContactOptionOptions,
  LanguageOptions,
  StyleOptions,
} from "@/components/select-options";
import { Switch } from "@workspace/ui/components/ui/switch";
import { SubmitButton } from "@/components/custom-buttons";
import { CreateWebsite } from "./CreateWebsite";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group";
import { Button } from "@workspace/ui/components/ui/button";
import {
  GlobeIcon,
  PencilIcon,
  ShareIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@workspace/ui/components/icons";
import { MailIcon } from "lucide-react";
import PhoneInput from "@/components/phone-input";
import { Input } from "@workspace/ui/components/ui/input";

type Website = z.infer<typeof websiteSchema>;

export default function WebsitePage() {
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
    city: {
      es: "Ciudad",
      en: "City",
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
    color: {
      es: "Color",
      en: "Color",
    },
    style: {
      es: "Estilo",
      en: "Style",
    },
    email: {
      es: "Email",
      en: "Email",
    },
    website: {
      es: "Sitio web",
      en: "Website",
    },
    socials: {
      es: "Redes sociales",
      en: "Socials",
    },
    phone: {
      es: "Teléfono",
      en: "Phone",
    },
    contactOptions: {
      es: "Boton de adopción",
      en: "Adoption button",
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
              <Input value={`${data?.slug || ""}.capu.pet`} readOnly />
            </FormControl>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 pb-6">
              <Button
                className="col-span-full sm:col-span-1"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  if (import.meta.env.VITE_DEV) {
                    window.open(
                      "http://localhost:4321/ugc/" + data?.slug,
                      "_blank"
                    );
                  } else {
                    window.open(data?.slug + ".capu.pet", "_blank");
                  }
                }}
              >
                <SquareArrowOutUpRightIcon className="size-4" />
                {t("visit")}
              </Button>
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input value={field.value ?? ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
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
              name="contactOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contactOptions")}</FormLabel>
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
                    <ContactOptionOptions />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={websitesForm.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("color")}</FormLabel>
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
                    <ColorOptions />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={websitesForm.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("style")}</FormLabel>
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
                    <StyleOptions />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormLabel>{t("phone")}</FormLabel>
          <div className="flex w-full">
            <FormField
              control={websitesForm.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="pl-2 pr-1 w-16 justify-end rounded-r-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={websitesForm.control}
              name="phone"
              render={({ field }) => (
                <>
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="rounded-l-none border-l-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

          <FormField
            control={websitesForm.control}
            name="instagram"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormLabel>{t("socials")}</FormLabel>

                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InstagramIcon className="size-4 mr-1" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Instagram"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={websitesForm.control}
            name="facebook"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <FacebookIcon className="size-4 mr-1" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Facebook"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={websitesForm.control}
            name="youtube"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <YouTubeIcon className="size-4 mr-1" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="YouTube"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={websitesForm.control}
            name="website"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <GlobeIcon className="size-4 mr-1" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder={t("website")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={websitesForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <MailIcon className="size-4 mr-1" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder={t("email")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </InputGroup>
                </FormControl>
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
