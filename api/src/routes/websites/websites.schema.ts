import { z } from "zod/v4";
import { contactOptionsArray, stylesArray } from "../../db/websites.db";
import { emailSchema } from "../../lib/schemas";

export const websiteSchema = z.object({
  active: z.boolean(),
  description: z.string().nullable(),
  language: z.string().min(1),
  color: z.string().max(15),
  style: z.enum(stylesArray),
  city: z.string().nullable(),
  instagram: z.string().nullable(),
  facebook: z.string().nullable(),
  youtube: z.string().nullable(),
  email: emailSchema.nullable(),
  website: z.string().nullable(),
  phone: z.string().nullable(),
  countryCode: z.string().nullable(),
  contactOption: z.enum(contactOptionsArray).nullable(),
});

export const changeUrlSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9ñ-]+$/)
    .toLowerCase(),
});
