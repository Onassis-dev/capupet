import { useParams } from "react-router";
import { api, get } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n, useLanguage } from "@/hooks/use-i18n";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";
import { FilesForm } from "./FilesForm";
import { CrudTable } from "@/components/CrudTable";

export const PetFiles = () => {
  const { language } = useLanguage();
  const t = useI18n({
    deleteTitle: {
      es: "Eliminar archivo",
      en: "Delete file",
    },
    deleteText: {
      es: "¿Estás seguro de querer eliminar este archivo?",
      en: "Are you sure you want to delete this file?",
    },
    name: {
      es: "Nombre",
      en: "Name",
    },
    size: {
      es: "Tamaño",
      en: "Size",
    },
    createdAt: {
      es: "Subido",
      en: "Uploaded",
    },
  });
  const { id } = useParams();
  const client = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Record<
    string,
    unknown
  > | null>(null);

  const { data: files } = useQuery({
    queryKey: ["files", id],
    queryFn: () => get(api.files.$get({ query: { petId: id! } })),
  });

  return (
    <>
      <div className="mb-4">
        <FilesForm />
      </div>

      <div className="sm:border rounded-2xl sm:overflow-hidden border-b-0">
        <CrudTable
          rows={files}
          status="success"
          columns={[
            {
              key: "extension",
              title: "",
              transform: (v) => {
                return (
                  <img
                    src={getExtensionIcon(v as string)}
                    alt="Extension"
                    className="size-6"
                  />
                );
              },
              icon: true,
            },
            {
              key: "name",
              title: t("name"),
              transform: (v) => (
                <span className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {v as string}
                </span>
              ),
            },
            {
              key: "size",
              title: t("size"),
              hide: true,
              transform: (v) => (
                <span className="text-sm text-muted-foreground">
                  {formatBytes(v as number)}
                </span>
              ),
            },
            {
              key: "createdAt",
              title: t("createdAt"),
              hide: true,
              transform: (v) => (
                <span className="text-sm text-muted-foreground">
                  {new Date(v as string).toLocaleDateString(language, {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              ),
            },
          ]}
          onRowClick={(row) => {
            window.open(
              api.files.download.$url({ query: { id: row.id as string } }),
              "_blank"
            );
          }}
          selectRow={setSelectedFile}
          setOpenDelete={setOpenDelete}
        />
      </div>

      <DeleteDialog
        title={t("deleteTitle")}
        action="delete"
        text={t("deleteText")}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteFunction={async () => {
          await get(
            api.files.$delete({ json: { id: selectedFile!.id as number } })
          );
          client.setQueryData(["files", id], (old: Record<string, unknown>[]) =>
            old.filter((file) => file.id !== selectedFile!.id)
          );
          setSelectedFile(null);
          setOpenDelete(false);
        }}
      />
    </>
  );
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function getExtensionIcon(extension: string) {
  const extensionIcons = {
    docx: "doc.svg",
    doc: "doc.svg",
    xlsx: "excel.svg",
    xls: "excel.svg",
    jpg: "image.svg",
    jpeg: "image.svg",
    png: "image.svg",
    pdf: "pdf.svg",
  };

  return (
    "/file-icons/" +
    (extensionIcons[extension as keyof typeof extensionIcons] || "unknown.svg")
  );
}
