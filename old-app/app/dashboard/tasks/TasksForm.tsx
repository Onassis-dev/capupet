import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { taskSchema } from "@server/routes/tasks/tasks.schema";
import { Textarea } from "@/components/ui/textarea";

interface props {
  task: Record<string, unknown> | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedTask: (task: Record<string, unknown> | null) => void;
}

const defaultValues: z.infer<typeof taskSchema> = {
  id: 0,
  title: "",
  description: "",
  due: "",
  hour: "",
};

export const TasksForm = ({ task, open, setOpen, setSelectedTask }: props) => {
  const client = useQueryClient();

  const t = useI18n({
    registerTask: {
      es: "Registrar tarea",
      en: "Register task",
    },
    editTask: {
      es: "Editar tarea",
      en: "Edit task",
    },
    title: {
      es: "Título",
      en: "Title",
    },
    description: {
      es: "Descripción",
      en: "Description",
    },
    due: {
      es: "Fecha",
      en: "Due",
    },
    allDay: {
      es: "Todo el día",
      en: "All day",
    },
    taskUpdated: {
      es: "Tarea actualizada",
      en: "Task updated",
    },
    taskRegistered: {
      es: "Tarea registrada",
      en: "Task registered",
    },
  });

  const tasksForm = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(values: z.infer<typeof taskSchema>) {
      if (task)
        await get(api.tasks.$put({ json: { ...values, id: Number(task.id) } }));
      else await get(api.tasks.$post({ json: values }));

      showSuccess(task ? t("taskUpdated") : t("taskRegistered"));
      client.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    tasksForm.reset(task || defaultValues);
  }, [task, tasksForm]);

  const submit = tasksForm.handleSubmit((values: z.infer<typeof taskSchema>) =>
    mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={task ? t("editTask") : t("registerTask")}
      trigger={t("registerTask")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedTask(null)}
    >
      <Form {...tasksForm}>
        <form onSubmit={submit}>
          <FormField
            control={tasksForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("title")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={tasksForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    className="resize-none"
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
