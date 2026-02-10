import { z } from "zod/v4";
import { dateSchema } from "../../lib/schemas";

export const selectMedicalSchema = z.object({
  petId: z.coerce.number(),
});

export const editMedicalSchema = z.object({
  id: z.coerce.number(),
  medicalOptionId: z.coerce.number().min(1),
  date: dateSchema,
  notes: z.string().nullish(),
});

export const createMedicalSchema = z.object({
  petId: z.coerce.number(),
  medicalOptionId: z.coerce.number().min(1),
  date: dateSchema,
  notes: z.string().nullish(),
});
