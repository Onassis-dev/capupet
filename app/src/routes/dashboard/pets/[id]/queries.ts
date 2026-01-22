import { api, get } from '@/lib/api';

export const getPetGeneralInfo = (id: string) =>
  get(api.pets.general.$get({ query: { id: String(id) } }));

export type PetGeneralInfo =
  | Awaited<ReturnType<typeof getPetGeneralInfo>>
  | undefined;
