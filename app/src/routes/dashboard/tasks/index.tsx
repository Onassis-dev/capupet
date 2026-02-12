import { useFilter } from "@/hooks/use-filter";
import { usePagination } from "@/hooks/use-pagination";
import { api, get } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PaginationMenu from "@/components/PaginationMenu";
import { OptionsGrid } from "@workspace/ui/components/ui/grids";
import { SearchInput } from "@/components/custom-inputs";
import { CrudTable } from "@/components/CrudTable";
import { useSelectedRow } from "@/hooks/use-selected-row";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { useI18n } from "@/hooks/use-i18n";
import { TasksForm } from "./TasksForm";
import { PageWrapper } from "@/components/PageWrapper";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/ui/select";
import { CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export default function TasksPage() {
  const t = useI18n({
    title: {
      es: "Título",
      en: "Title",
    },
    due: {
      es: "Fecha",
      en: "Due",
    },
    deleteTitle: {
      es: "Eliminar tarea",
      en: "Delete Task",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta tarea?",
      en: "Are you sure you want to delete this task?",
    },
    pageTitle: {
      es: "Tareas",
      en: "Tasks",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [done, setDone] = useState("false");

  const client = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["tasks", debouncedFilter, page, done],
    queryFn: () =>
      get(
        api.tasks.$get({
          query: {
            text: debouncedFilter,
            page: String(page),
            done,
          },
        })
      ),
  });

  return (
    <PageWrapper title={t("pageTitle")} size="md">
      <OptionsGrid>
        <div className="flex items-center gap-2">
          <SearchInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <Select value={done} onValueChange={(value) => setDone(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Completado</SelectItem>
              <SelectItem value="false">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TasksForm
          open={openEdit}
          setOpen={setOpenEdit}
          setSelectedTask={setSelectedRow}
          task={selectedRow}
        />
      </OptionsGrid>

      <CrudTable
        rows={data?.rows}
        status={status}
        columns={[
          {
            key: "done",
            icon: true,
            title: "",
            transform: (done, row) => (
              <button
                className={cn(
                  "size-5 rounded-full cursor-pointer border-2 flex items-center justify-center",
                  done
                    ? "bg-foreground text-background border-0"
                    : "border-input"
                )}
                onClick={async (e) => {
                  e.stopPropagation();

                  await get(
                    api.tasks.complete.$put({
                      json: { id: Number(row.id), done: !done },
                    })
                  );
                  client.invalidateQueries({ queryKey: ["tasks"] });
                }}
              >
                {done ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
              </button>
            ),
          },
          { key: "title", title: t("title"), full: true },
        ]}
        selectRow={setSelectedRow}
        setOpenDelete={setOpenDelete}
        setOpenEdit={setOpenEdit}
        onRowClick={(row) => {
          setSelectedRow(row);
          setOpenEdit(true);
        }}
      />

      <PaginationMenu
        page={Number(page)}
        setPage={setPage}
        count={data?.count}
      />

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        queryKey="tasks"
        deleteFunction={() =>
          get(api.tasks.$delete({ json: { id: Number(selectedRow?.id) } }))
        }
      />
    </PageWrapper>
  );
}
