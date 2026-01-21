import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { changeUrlSchema } from "@server/routes/websites/websites.schema";
import { TriangleAlertIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/components/ui/input-group";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const defaultValues: z.infer<typeof changeUrlSchema> = {
  url: "",
};

export const ChangeUrl = ({ open, setOpen }: props) => {
  const client = useQueryClient();

  const t = useI18n({
    title: {
      es: "Actualizar url",
      en: "Update url",
    },
    alert: {
      es: "Cambiar la url tiene los siguientes efectos:",
      en: "Changing the url has the following effects:",
    },
  });

  const urlForm = useForm<z.infer<typeof changeUrlSchema>>({
    resolver: zodResolver(changeUrlSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof changeUrlSchema>
    ) {
      await get(api.websites.url.$put({ json: { ...values } }));

      client.setQueryData(["websites"], (old: object) => ({
        ...old,
        url: values.url,
      }));
      setOpen(false);
    },
  });

  const submit = urlForm.handleSubmit(
    (values: z.infer<typeof changeUrlSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={t("title")}
      submit={submit}
      isPending={isPending}
      reset={() => urlForm.reset(defaultValues)}
    >
      <Form {...urlForm}>
        <form onSubmit={submit}>
          <Alert variant="destructive">
            <TriangleAlertIcon strokeWidth={1.8} />
            <AlertTitle>{t("alert")}</AlertTitle>
          </Alert>

          <FormField
            control={urlForm.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("title")}</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>capupet.com/</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                  </InputGroup>
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
