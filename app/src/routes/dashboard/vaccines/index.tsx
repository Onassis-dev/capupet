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
import { VaccinesForm } from "./VaccinesForm";
import { PageWrapper } from "@/components/PageWrapper";

export default function VaccinesPage() {
  const t = useI18n({
    name: {
      es: "Nombre",
      en: "Name",
    },
    deleteTitle: {
      es: "Eliminar vacuna",
      en: "Delete Vaccine",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta vacuna?",
      en: "Are you sure you want to delete this vaccine?",
    },
    pageTitle: {
      es: "Vacunas",
      en: "Vaccines",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, status } = useQuery({
    queryKey: ["vaccines", debouncedFilter, page],
    queryFn: () =>
      get(
        api.vaccines.$get({
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

        <VaccinesForm
          open={openEdit}
          setOpen={setOpenEdit}
          setSelectedVaccine={setSelectedRow}
          vaccine={selectedRow}
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
        queryKey="vaccines"
        deleteFunction={() =>
          get(api.vaccines.$delete({ json: { id: Number(selectedRow?.id) } }))
        }
      />
    </PageWrapper>
  );
}
