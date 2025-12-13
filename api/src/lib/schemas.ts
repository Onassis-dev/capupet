import { z } from "zod/v4";

export const idSchema = z.coerce.number();

export const emailSchema = z.email().or(z.string().length(0));

export const dateSchema = z
  .string()
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const timeSchema = z
  .string()
  .length(0)
  .or(z.string().regex(/^\d{2}:\d{2}$/));

export const deleteSchema = z.object({
  id: idSchema,
});
