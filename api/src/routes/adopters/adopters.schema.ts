import { z } from "zod/v4";
import { emailSchema, idSchema } from "../../lib/schemas";

export const searchAdoptersSchema = z.object({
  text: z.string().nullable(),
  page: z.coerce.number(),
});

export const createAdopterSchema = z.object({
  name: z.string().min(1),
  email: emailSchema.nullable(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateAdopterSchema = createAdopterSchema.extend({
  id: idSchema,
});

export const adopterSchema = createAdopterSchema.extend({
  id: z.number(),
});
