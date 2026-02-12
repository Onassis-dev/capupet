import { z } from "zod/v4";
import { idSchema } from "../../lib/schemas";

export const searchTasksSchema = z.object({
  text: z.string().nullable(),
  page: z.coerce.number(),
  done: z.string().transform((val) => val === "true"),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
});

export const updateTaskSchema = createTaskSchema.extend({
  id: idSchema,
});

export const completeTaskSchema = z.object({
  id: idSchema,
  done: z.boolean(),
});

export const taskSchema = createTaskSchema.extend({
  id: z.number(),
});
