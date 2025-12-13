"use client";

import { useFilter } from "@/hooks/use-filter";
import { usePagination } from "@/hooks/use-pagination";
import { api, get } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import PaginationMenu from "@/components/PaginationMenu";
import { OptionsGrid } from "@/components/ui/grids";
import { SearchInput } from "@/components/ui/custom-inputs";
import { CrudTable } from "@/components/CrudTable";
import { useSelectedRow } from "@/hooks/use-selected-row";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { useI18n } from "@/hooks/use-i18n";
import { PetsForm } from "./PetsForm";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  CatIcon,
  DogIcon,
  CircleDashedIcon,
  MarsIcon,
  VenusIcon,
  CircleQuestionMarkIcon,
} from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";

export default function Page() {
  const t = useI18n({
    male: {
      es: "Macho",
      en: "Male",
    },
    female: {
      es: "Hembra",
      en: "Female",
    },
    unknown: {
      es: "Desconocido",
      en: "Unknown",
    },
    dog: {
      es: "Perro",
      en: "Dog",
    },
    cat: {
      es: "Gato",
      en: "Cat",
    },
    other: {
      es: "Otro",
      en: "Other",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    species: {
      es: "Especie",
      en: "Species",
    },
    sex: {
      es: "Sexo",
      en: "Sex",
    },
    status: {
      es: "Estado",
      en: "Status",
    },
    deleteTitle: {
      es: "Eliminar mascota",
      en: "Delete Pet",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar esta mascota?",
      en: "Are you sure you want to delete this pet?",
    },
    deleteSuccessMessage: {
      es: "Mascota eliminada correctamente",
      en: "Pet deleted successfully",
    },
    title: {
      es: "Mascotas",
      en: "Pets",
    },
  });

  const { page, setPage } = usePagination();
  const { filter, setFilter, debouncedFilter } = useFilter(() => setPage(1));
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  const { data, status } = useQuery({
    queryKey: ["pets", "table", debouncedFilter, page],
    queryFn: () =>
      get(
        api.pets.$get({
          query: { name: debouncedFilter, page: String(page) },
        })
      ),
  });

  return (
    <PageWrapper title={t("title")} size="lg">
      <OptionsGrid>
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <PetsForm />
      </OptionsGrid>

      <CrudTable
        onRowClick={(row) => {
          router.push(`/dashboard/pets/${row.id}`);
        }}
        rows={data?.rows}
        status={status}
        columns={[
          { key: "name", title: t("name") },
          {
            key: "species",
            title: t("species"),
            transform: (v) => {
              if (v === "dog")
                return (
                  <Badge variant="secondary">
                    <DogIcon />
                    {t("dog")}
                  </Badge>
                );
              if (v === "cat")
                return (
                  <Badge variant="secondary">
                    <CatIcon />
                    {t("cat")}
                  </Badge>
                );
              if (v === "other")
                return (
                  <Badge variant="secondary">
                    <CircleDashedIcon />
                    {t("other")}
                  </Badge>
                );
            },
          },
          {
            key: "sex",
            title: t("sex"),
            hide: true,
            transform: (v) => {
              if (v === "male")
                return (
                  <Badge variant="secondary">
                    <MarsIcon />
                    {t("male")}
                  </Badge>
                );
              if (v === "female")
                return (
                  <Badge variant="secondary">
                    <VenusIcon />
                    {t("female")}
                  </Badge>
                );
              if (v === "unknown")
                return (
                  <Badge variant="secondary">
                    <CircleQuestionMarkIcon />
                    {t("unknown")}
                  </Badge>
                );
            },
          },
          {
            key: "status",
            title: t("status"),
            hide: true,
            transform: (v) => {
              return <Badge variant="secondary">{v as string}</Badge>;
            },
          },
        ]}
        selectRow={setSelectedRow}
        setOpenDelete={setOpenDelete}
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
        queryKey="pets"
        deleteFunction={() =>
          get(api.pets.$delete({ json: { id: Number(selectedRow?.id) } }))
        }
        successMessage={t("deleteSuccessMessage")}
      />
    </PageWrapper>
  );
}
