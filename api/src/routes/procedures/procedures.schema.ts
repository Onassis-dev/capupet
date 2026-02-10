import { z } from "zod/v4";
import { idSchema } from "../../lib/schemas";

export const searchProceduresSchema = z.object({
  text: z.string().nullable(),
  page: z.coerce.number(),
});

export const createProcedureSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export const updateProcedureSchema = createProcedureSchema.extend({
  id: idSchema,
});

export const procedureSchema = createProcedureSchema.extend({
  id: z.number(),
});
