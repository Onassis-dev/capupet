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
import { PermissionsForm } from "./PermissionsForm";
import { PageWrapper } from "@/components/PageWrapper";
import { Badge } from "@workspace/ui/components/ui/badge";

export default function PermissionsPage() {
  const t = useI18n({
    name: {
      es: "Nombre",
      en: "Name",
    },
    email: {
      es: "Correo",
      en: "Email",
    },
    deleteTitle: {
      es: "Eliminar permiso",
      en: "Delete Permission",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar este permiso?",
      en: "Are you sure you want to delete this permission?",
    },
    pageTitle: {
      es: "Permisos",
      en: "Permissions",
    },
    invitation: {
      es: "Invitación",
      en: "Invitation",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, status } = useQuery({
    queryKey: ["permissions", debouncedFilter, page],
    queryFn: () =>
      get(
        api.permissions.$get({
          query: { name: debouncedFilter, page: String(page) },
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

        <PermissionsForm
          open={openEdit}
          setOpen={setOpenEdit}
          setSelectedPermission={setSelectedRow}
          permission={selectedRow}
        />
      </OptionsGrid>

      <CrudTable
        rows={data}
        status={status}
        columns={[
          {
            key: "name",
            title: t("name"),
            transform: (v) =>
              v || <Badge variant="secondary">{t("invitation")}</Badge>,
          },
          { key: "email", title: t("email"), hide: true },
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
        count={data?.[0]?.count}
      />

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        queryKey="permissions"
        deleteFunction={() =>
          get(
            api.permissions.$delete({ json: { id: Number(selectedRow?.id) } })
          )
        }
      />
    </PageWrapper>
  );
}
