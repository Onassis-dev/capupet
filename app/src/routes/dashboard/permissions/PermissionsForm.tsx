import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/ui/form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { Switch } from "@workspace/ui/components/ui/switch";
import { createPermissionSchema } from "@server/routes/permissions/permissions.schema";

interface props {
  permission: Record<string, unknown> | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedPermission: (permission: Record<string, unknown> | null) => void;
}

const defaultValues: z.infer<typeof createPermissionSchema> = {
  users: false,
  pets: false,
  adopters: false,
  tasks: false,
  website: false,
};

export const PermissionsForm = ({
  permission,
  open,
  setOpen,
  setSelectedPermission,
}: props) => {
  const client = useQueryClient();

  const t = useI18n({
    user: {
      es: "Usuario",
      en: "User",
    },
    registerUser: {
      es: "Registrar usuario",
      en: "Register user",
    },
    editUser: {
      es: "Editar usuario",
      en: "Edit user",
    },
    users: {
      es: "Usuarios",
      en: "Users",
    },
    pets: {
      es: "Mascotas",
      en: "Pets",
    },
    adopters: {
      es: "Adoptantes",
      en: "Adopters",
    },
    tasks: {
      es: "Tareas",
      en: "Tasks",
    },
    website: {
      es: "Sitio web",
      en: "Website",
    },
  });

  const permissionsForm = useForm<z.infer<typeof createPermissionSchema>>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof createPermissionSchema>
    ) {
      if (permission)
        await get(
          api.permissions.$put({
            json: { ...values, id: Number(permission.id) },
          })
        );
      else await get(api.permissions.$post({ json: values }));

      client.invalidateQueries({ queryKey: ["permissions"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    permissionsForm.reset(
      permission
        ? {
            users: Boolean(permission.users),
            pets: Boolean(permission.pets),
            adopters: Boolean(permission.adopters),
            tasks: Boolean(permission.tasks),
            website: Boolean(permission.website),
          }
        : defaultValues
    );
  }, [permission, permissionsForm]);

  const submit = permissionsForm.handleSubmit(
    (values: z.infer<typeof createPermissionSchema>) => mutate(values)
  );

  const fields = ["pets", "adopters", "tasks", "website", "users"] as const;

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={permission ? t("editUser") : t("registerUser")}
      trigger={t("registerUser")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedPermission(null)}
    >
      <Form {...permissionsForm}>
        <form onSubmit={submit} className="space-y-4 mb-4">
          {fields.map((field) => (
            <FormField
              key={field}
              control={permissionsForm.control}
              name={field}
              render={({ field: f }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>{t(field)}</FormLabel>
                  <FormControl>
                    <Switch checked={f.value} onCheckedChange={f.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>

      {permission?.name ? (
        <div className="space-y-2 mb-4 border-t pt-4">
          <div>
            <p className="text-sm font-bold">{String(permission.name)}</p>
            <p className="text-sm">{String(permission.email)}</p>
          </div>
        </div>
      ) : null}
    </ModalForm>
  );
};
