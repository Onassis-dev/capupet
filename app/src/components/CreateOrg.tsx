import { createOrgSchema } from "@workspace/api/src/routes/organizations/organizations.schema";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@workspace/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { Input } from "@workspace/ui/components/ui/input";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, get } from "@/lib/api";
import { useNavigate } from "react-router";
import { Button } from "@workspace/ui/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const defaultValues: z.infer<typeof createOrgSchema> = {
  name: "",
};

export const CreateOrganization = ({ open, setOpen }: props) => {
  const t = useI18n({
    createOrganization: {
      es: "Crear organización",
      en: "Create organization",
    },
    organizationNamePlaceholder: {
      es: "Ingresa el nombre de tu organización",
      en: "Enter the name of your organization",
    },
    create: {
      es: "Crear",
      en: "Create",
    },
  });
  const client = useQueryClient();
  const navigate = useNavigate();

  const organizationForm = useForm<z.infer<typeof createOrgSchema>>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof createOrgSchema>
    ) {
      await get(api.organizations.$post({ json: values }));
      client.invalidateQueries({ queryKey: ["session"] });
      setOpen(false);
      navigate("/");
    },
  });

  const submitCreateOrganization = organizationForm.handleSubmit(
    (values: z.infer<typeof createOrgSchema>) => mutate(values)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t("createOrganization")}</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Form {...organizationForm}>
            <form className="" onSubmit={submitCreateOrganization}>
              <FormField
                control={organizationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t("organizationNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} className="w-full md:w-20">
                {t("create")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
