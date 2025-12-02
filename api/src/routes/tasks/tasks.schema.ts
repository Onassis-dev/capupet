import { z } from "zod/v4";
import { dateSchema, idSchema, timeSchema } from "../../lib/schemas";

export const searchTasksSchema = z.object({
  text: z.string().nullable(),
  page: z.coerce.number(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  due: dateSchema.nullable(),
  hour: timeSchema.nullable(),
});

export const updateTaskSchema = createTaskSchema.extend({
  id: idSchema,
});

export const taskSchema = createTaskSchema.extend({
  id: z.number(),
});
