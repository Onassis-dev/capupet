import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs";
import { GeneralInfo } from "./GeneralInfo";
import { PublicInfo } from "./PublicInfo";
import { Badge } from "@workspace/ui/components/ui/badge";
import { PageWrapper } from "@/components/PageWrapper";
import { useI18n } from "@/hooks/use-i18n";
import {
  CatIcon,
  CircleDashedIcon,
  DogIcon,
  Loader2Icon,
  PencilIcon,
} from "lucide-react";
import { useState } from "react";
import { api, get } from "@/lib/api";
import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPetGeneralInfo } from "./queries";

export default function PetDetailPage() {
  const t = useI18n({
    general: {
      es: "General",
      en: "General",
    },
    public: {
      es: "Público",
      en: "Public",
    },
    medical: {
      es: "Médico",
      en: "Medical",
    },
    notes: {
      es: "Notas",
      en: "Notes",
    },
    files: {
      es: "Archivos",
      en: "Files",
    },
    available: {
      es: "Disponible",
      en: "Available",
    },
    adopted: {
      es: "Adoptado",
      en: "Adopted",
    },
    deceased: {
      es: "Fallecido",
      en: "Deceased",
    },
    intake: {
      es: "En proceso",
      en: "Intake",
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["pets", "general", id],
    queryFn: () => getPetGeneralInfo(id!),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <PageWrapper size="sm">
      <Tabs defaultValue="general">
        <div className="flex items-center gap-4 sm:gap-6 mb-4">
          <button
            className="relative cursor-pointer"
            disabled={isUploading}
            onClick={() => {
              setIsUploading(true);
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                const file = input.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("file", file);
                  const data = await get(
                    api.pets.image.$post({
                      form: {
                        id: String(id),
                        file,
                      },
                    })
                  );

                  queryClient.setQueryData(
                    ["pets", "general", id],
                    (old: Record<string, unknown>) => ({
                      ...old,
                      image: data.image,
                    })
                  );
                  setIsUploading(false);
                }
              };
              input.click();
            }}
          >
            {data?.image ? (
              <img
                src={data?.image || ""}
                alt="Dog"
                className="size-24 rounded-full object-cover"
              />
            ) : (
              <div className="size-24 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                {data?.species === "dog" && <DogIcon className="size-12" />}
                {data?.species === "cat" && <CatIcon className="size-12" />}
                {data?.species === "other" && (
                  <CircleDashedIcon className="size-12" />
                )}
                {status === "pending" && (
                  <Loader2Icon className="size-12 animate-spin" />
                )}
              </div>
            )}
            <div className="absolute p-2 rounded-full right-0 bottom-0 bg-primary text-primary-foreground">
              <PencilIcon className="size-4" />
            </div>
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">{data?.name}</h1>
            <Badge variant="secondary">{t(data?.status as any)}</Badge>
          </div>
        </div>
        <TabsList className="mb-6 w-[calc(100%+2rem)] -mx-4 sm:mx-0 sm:w-full text-sm sm:text-base">
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="public">{t("public")}</TabsTrigger>
          <TabsTrigger value="medical">{t("medical")}</TabsTrigger>
          <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
          <TabsTrigger value="files">{t("files")}</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralInfo data={data} />
        </TabsContent>
        <TabsContent value="public">
          <PublicInfo data={data} />
        </TabsContent>
        <TabsContent value="medical">Medical</TabsContent>
        <TabsContent value="notes">Notes</TabsContent>
        <TabsContent value="files">Files</TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
