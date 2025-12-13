import { z } from "zod/v4";

export const websiteSchema = z.object({
  url: z.string().min(1),
  active: z.boolean(),
  description: z.string().nullable(),
  language: z.string().min(1),
});
