import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/ui/form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api, get } from "@/lib/api";
import { useI18n } from "@/hooks/use-i18n";
import { ModalForm } from "@/components/ModalForm";
import { Textarea } from "@workspace/ui/components/ui/textarea";
import { useParams } from "react-router";
import { createNoteSchema } from "@server/routes/notes/notes.schema";

interface Note {
  id: number;
  content: string;
  createdAt?: string;
  creatorName?: string;
}

interface props {
  note: Note | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedNote: (note: Note | null) => void;
}

const noteFormSchema = createNoteSchema.pick({ content: true });

export const NotesForm = ({ note, open, setOpen, setSelectedNote }: props) => {
  const client = useQueryClient();
  const { id } = useParams();

  const t = useI18n({
    addNote: {
      es: "Agregar nota",
      en: "Add note",
    },
    editNote: {
      es: "Editar nota",
      en: "Edit note",
    },
    content: {
      es: "Contenido",
      en: "Content",
    },
  });

  const notesForm = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema as any),
    defaultValues: { content: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function sendData(
      values: z.infer<typeof noteFormSchema>
    ) {
      const content = values.content || null;
      if (note) {
        await get(api.notes.$put({ json: { id: note.id, content } }));
        client.setQueryData(["notes", id], (old: Record<string, unknown>[]) =>
          old.map((n) => (n.id === note.id ? { ...n, content } : n))
        );
      } else {
        const newNote = await get(
          api.notes.$post({ json: { petId: Number(id), content } })
        );
        client.setQueryData(["notes", id], (old: Record<string, unknown>[]) => [
          { ...newNote, content },
          ...old,
        ]);
      }

      notesForm.reset({ content: "" });
      setOpen(false);
    },
  });

  useEffect(() => {
    if (note) {
      notesForm.reset({ content: note.content || "" });
    } else {
      notesForm.reset({ content: "" });
    }
  }, [note, notesForm]);

  const submit = notesForm.handleSubmit(
    (values: z.infer<typeof noteFormSchema>) => mutate(values)
  );

  return (
    <ModalForm
      open={open}
      setOpen={setOpen}
      title={note ? t("editNote") : t("addNote")}
      trigger={t("addNote")}
      submit={submit}
      isPending={isPending}
      reset={() => setSelectedNote(null)}
    >
      <Form {...notesForm}>
        <form onSubmit={submit}>
          <FormField
            control={notesForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
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
