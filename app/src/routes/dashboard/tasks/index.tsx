import { useFilter } from "@/hooks/use-filter";
import { usePagination } from "@/hooks/use-pagination";
import { api, get } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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
    deleteSuccessMessage: {
      es: "Tarea eliminada correctamente",
      en: "Task deleted successfully",
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

  const { data, status } = useQuery({
    queryKey: ["tasks", debouncedFilter, page],
    queryFn: () =>
      get(
        api.tasks.$get({
          query: { text: debouncedFilter, page: String(page) },
        })
      ),
  });
  return (
    <PageWrapper title={t("pageTitle")} size="md">
      <OptionsGrid>
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

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
        columns={[{ key: "title", title: t("title") }]}
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
        successMessage={t("deleteSuccessMessage")}
      />
    </PageWrapper>
  );
}
