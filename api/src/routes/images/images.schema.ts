import { z } from "zod/v4";

export const uploadImageSchema = z.object({
  file: z.instanceof(File),
  petId: z.coerce.number(),
});

export const selectImagesSchema = z.object({
  petId: z.coerce.number(),
});

export const deleteImageSchema = z.object({
  url: z.string(),
});
