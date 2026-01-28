import { z } from "zod/v4";

export const createOrgSchema = z.object({
  name: z.string().min(3).max(40),
});

export const updateOrgSchema = z.object({
  name: z.string().min(3).max(40),
  file: z.instanceof(File).optional(),
});
