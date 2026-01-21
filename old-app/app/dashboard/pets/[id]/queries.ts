import { api, get } from "@/lib/api";
import { ParamValue } from "next/dist/server/request/params";

export const getPetGeneralInfo = (id: ParamValue) =>
  get(api.pets.general.$get({ query: { id: String(id) } }));

export type PetGeneralInfo =
  | Awaited<ReturnType<typeof getPetGeneralInfo>>
  | undefined;
