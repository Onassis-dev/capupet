"use client";

import { useQuery } from "@tanstack/react-query";
import { api, get } from "@/lib/api";
import { useLanguage } from "./use-i18n";
import { useRouter } from "next/navigation";

type SessionResponse = Awaited<ReturnType<typeof getSession>>;

export let session: SessionResponse | null =
  typeof window !== "undefined"
    ? (JSON.parse(
        sessionStorage.getItem("session") || "null"
      ) as SessionResponse) || null
    : null;

const getSession = () => get(api.users.session.$get());

export function useSession() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const { data, isPending } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await getSession();
      if (
        !response.user.verified &&
        window.location.pathname !== "/verify-email"
      )
        router.push("/verify-email");

      if (response.user.lang === "es" || response.user.lang === "en") {
        setLanguage(response.user.lang);
      }

      session = response;
      sessionStorage.setItem("session", JSON.stringify(response));
      return response;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { session: data, isPending };
}

export type PermissionType = keyof NonNullable<typeof session>["user"];

export function canEdit(permission: PermissionType) {
  return session?.user[permission];
}
