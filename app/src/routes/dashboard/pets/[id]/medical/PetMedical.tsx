import { useParams } from "react-router";
import { api, get } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/hooks/use-i18n";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { MedicalForm } from "./MedicalForm";
import { CrudTable } from "@/components/CrudTable";
import { Badge } from "@workspace/ui/components/ui/badge";

export const PetMedical = () => {
  const t = useI18n({
    deleteTitle: {
      es: "Eliminar registro médico",
      en: "Delete medical record",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar este registro médico?",
      en: "Are you sure you want to delete this medical record?",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    type: {
      es: "Tipo",
      en: "Type",
    },
    vaccine: {
      es: "Vacuna",
      en: "Vaccine",
    },
    procedure: {
      es: "Procedimiento",
      en: "Procedure",
    },
  });
  const { id } = useParams();
  const client = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedMedical, setSelectedMedical] = useState<any>(null);

  const { data: records } = useQuery({
    queryKey: ["medical", id],
    queryFn: () => get(api.medical.$get({ query: { petId: id! } })),
  });

  const { data: options } = useQuery({
    queryKey: ["medicalOptions"],
    queryFn: () => get(api.medical.options.$get()),
  });

  return (
    <>
      <div className="mb-4">
        <MedicalForm
          record={selectedMedical}
          open={openForm}
          setOpen={setOpenForm}
          setSelectedMedical={setSelectedMedical}
          options={options}
        />
      </div>

      <div className="sm:border rounded-2xl sm:overflow-hidden border-b-0!">
        <CrudTable
          rows={records}
          status="success"
          columns={[
            {
              key: "medicalOptionId",
              title: t("name"),
              transform: (v) => (
                <span className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {options?.find((option) => option.id === v)?.name}
                </span>
              ),
            },
            {
              key: "type",
              title: t("type"),
              transform: (v) => (
                <Badge variant="secondary">{t(v as any)}</Badge>
              ),
            },
          ]}
          onRowClick={(row: any) => {
            setSelectedMedical(row);
            setOpenForm(true);
          }}
          selectRow={setSelectedMedical}
          setOpenDelete={setOpenDelete}
          setOpenEdit={setOpenForm}
        />
      </div>

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteFunction={async () => {
          await get(api.medical.$delete({ json: { id: selectedMedical!.id } }));
          client.setQueryData(
            ["medical", id],
            (old: Record<string, unknown>[]) =>
              old.filter((r) => r.id !== selectedMedical!.id)
          );
          setSelectedMedical(null);
          setOpenDelete(false);
        }}
      />
    </>
  );
};
