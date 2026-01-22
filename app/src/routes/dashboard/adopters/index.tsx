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
import { AdoptersForm } from "./AdoptersForm";
import { PageWrapper } from "@/components/PageWrapper";

export default function AdoptersPage() {
  const t = useI18n({
    name: {
      es: "Nombre",
      en: "Name",
    },
    phone: {
      es: "Teléfono",
      en: "Phone",
    },
    deleteTitle: {
      es: "Eliminar adoptante",
      en: "Delete Adopter",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar este adoptante?",
      en: "Are you sure you want to delete this adopter?",
    },
    deleteSuccessMessage: {
      es: "Adoptante eliminado correctamente",
      en: "Adopter deleted successfully",
    },
    title: {
      es: "Adoptantes",
      en: "Adopters",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, status } = useQuery({
    queryKey: ["adopters", debouncedFilter, page],
    queryFn: () =>
      get(
        api.adopters.$get({
          query: { text: debouncedFilter, page: String(page) },
        })
      ),
  });
  return (
    <PageWrapper title={t("title")} size="md">
      <OptionsGrid>
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <AdoptersForm
          open={openEdit}
          setOpen={setOpenEdit}
          setSelectedAdopter={setSelectedRow}
          adopter={selectedRow}
        />
      </OptionsGrid>

      <CrudTable
        rows={data?.rows}
        status={status}
        columns={[
          { key: "name", title: t("name") },
          { key: "phone", title: t("phone"), hide: true },
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
        queryKey="adopters"
        deleteFunction={() =>
          get(api.adopters.$delete({ json: { id: Number(selectedRow?.id) } }))
        }
        successMessage={t("deleteSuccessMessage")}
      />
    </PageWrapper>
  );
}
