import { z } from "zod/v4";

export const selectFilesSchema = z.object({
  petId: z.coerce.number(),
});

export const createFileSchema = z.object({
  petId: z.coerce.number(),
  file: z.instanceof(File),
});

export const downloadFileSchema = z.object({
  id: z.coerce.number(),
});
