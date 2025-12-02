import { z } from "zod/v4";

export const idSchema = z.coerce.number();

export const emailSchema = z.string().length(0).or(z.email());
export const dateSchema = z
  .string()
  .length(0)
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
export const timeSchema = z
  .string()
  .length(0)
  .or(z.string().regex(/^\d{2}:\d{2}$/));

export const deleteSchema = z.object({
  id: idSchema,
});
