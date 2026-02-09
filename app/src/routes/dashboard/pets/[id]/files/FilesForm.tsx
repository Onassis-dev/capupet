import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { RegisterButton } from "@/components/custom-buttons";
import { api, get } from "@/lib/api";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { showError } from "@/lib/toast";
import { useI18n } from "@/hooks/use-i18n";

export const FilesForm = () => {
  const t = useI18n({
    error: {
      es: "Error al subir el archivo",
      en: "Error uploading file",
    },
  });

  const client = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();

  const openFileDialog = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      try {
        setIsUploading(true);
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const newFile = await get(
          api.files.$post({ form: { petId: id!, file } })
        );
        client.setQueryData(["files", id], (old: Record<string, unknown>[]) => [
          newFile,
          ...old,
        ]);
        setIsUploading(false);
      } catch {
        setIsUploading(false);
        showError(t("error"));
      }
    };
    input.click();
  };

  return (
    <RegisterButton onClick={openFileDialog} disabled={isUploading}>
      {isUploading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        "Agregar archivo"
      )}
    </RegisterButton>
  );
};
