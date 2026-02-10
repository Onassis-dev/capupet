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
import { ProceduresForm } from "./ProceduresForm";
import { PageWrapper } from "@/components/PageWrapper";

export default function ProceduresPage() {
  const t = useI18n({
    name: {
      es: "Nombre",
      en: "Name",
    },
    deleteTitle: {
      es: "Eliminar procedimiento",
      en: "Delete Procedure",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta procedimiento?",
      en: "Are you sure you want to delete this procedure?",
    },
    deleteSuccessMessage: {
      es: "Procedimiento eliminado correctamente",
      en: "Procedure deleted successfully",
    },
    pageTitle: {
      es: "Procedimientos",
      en: "Procedures",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, status } = useQuery({
    queryKey: ["procedures", debouncedFilter, page],
    queryFn: () =>
      get(
        api.procedures.$get({
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

        <ProceduresForm
          open={openEdit}
          setOpen={setOpenEdit}
          setSelectedProcedure={setSelectedRow}
          procedure={selectedRow}
        />
      </OptionsGrid>

      <CrudTable
        rows={data?.rows}
        status={status}
        columns={[{ key: "name", title: t("name") }]}
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
        queryKey="procedures"
        deleteFunction={() =>
          get(api.procedures.$delete({ json: { id: Number(selectedRow?.id) } }))
        }
        successMessage={t("deleteSuccessMessage")}
      />
    </PageWrapper>
  );
}
