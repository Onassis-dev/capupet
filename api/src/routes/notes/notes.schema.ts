import { z } from "zod/v4";

export const selectNotesSchema = z.object({
  petId: z.coerce.number(),
});

export const editNoteSchema = z.object({
  id: z.coerce.number(),
  content: z.string().min(1),
});

export const createNoteSchema = z.object({
  petId: z.coerce.number(),
  content: z.string().min(1),
});
