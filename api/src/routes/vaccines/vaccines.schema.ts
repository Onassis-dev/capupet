import { z } from "zod/v4";
import { idSchema } from "../../lib/schemas";

export const searchVaccinesSchema = z.object({
  text: z.string().nullable(),
  page: z.coerce.number(),
});

export const createVaccineSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export const updateVaccineSchema = createVaccineSchema.extend({
  id: idSchema,
});

export const vaccineSchema = createVaccineSchema.extend({
  id: z.number(),
});
