import { useParams } from "react-router";
import { api, get } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { NotesForm } from "./NotesForm";
import { Button } from "@workspace/ui/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

export const PetNotes = () => {
  const t = useI18n({
    deleteTitle: {
      es: "Eliminar nota",
      en: "Delete note",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta nota?",
      en: "Are you sure you want to delete this note?",
    },
  });
  const { id } = useParams();
  const client = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const { data: notes } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => get(api.notes.$get({ query: { petId: id! } })),
  });

  const { language } = useLanguage();

  return (
    <>
      <div className="mb-4">
        <NotesForm
          note={selectedNote}
          open={openForm}
          setOpen={setOpenForm}
          setSelectedNote={setSelectedNote}
        />
      </div>

      <div className="grid gap-4 grid-cols-1">
        {notes?.map((note) => (
          <div key={note.id} className="bg-secondary p-4 pb-2 rounded-2xl">
            <p>{note.content}</p>
            <div className="flex items-center gap-2 border-t mt-2 pt-1">
              <p className="text-sm text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString(language, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <Button
                className="size-8 ml-auto"
                variant="ghost"
                onClick={() => {
                  setSelectedNote(note);
                  setOpenDelete(true);
                }}
              >
                <TrashIcon className="size-4" />
              </Button>
              <Button
                className="size-8"
                variant="ghost"
                onClick={() => {
                  setSelectedNote(note);
                  setOpenForm(true);
                }}
              >
                <PencilIcon className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteFunction={async () => {
          await get(api.notes.$delete({ json: { id: selectedNote!.id } }));
          client.setQueryData(["notes", id], (old: Record<string, unknown>[]) =>
            old.filter((note) => note.id !== selectedNote!.id)
          );
          setSelectedNote(null);
          setOpenDelete(false);
        }}
      />
    </>
  );
};
