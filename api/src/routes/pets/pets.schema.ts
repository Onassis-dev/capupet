import {
  measurementsArray,
  sexesArray,
  sizeArray,
  speciesArray,
  statusArray,
} from "../../db/pets.db";
import { dateSchema } from "../../lib/schemas";
import { z } from "zod/v4";

export const selectPetsSchema = z.object({
  name: z.string().nullable(),
  page: z.coerce.number(),
});

export const createPetSchema = z.object({
  name: z.string().min(1),
  species: z.enum(speciesArray),
  sex: z.enum(sexesArray),
  status: z.enum(statusArray),
});

export const petGeneralInfoSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  species: z.enum(speciesArray),
  sex: z.enum(sexesArray),
  admissionDate: dateSchema.nullish(),
  bornDate: dateSchema.nullish(),
  size: z.enum(sizeArray).nullish(),
  weight: z.string().nullish(),
  measurement: z.enum(measurementsArray).nullish(),
  comments: z.string().nullish(),
  status: z.enum(statusArray),
});

export const publicPetSchema = z.object({
  id: z.number(),
  publicDescription: z.string().nullish(),
  public: z.boolean(),
});

export const uploadPetImageSchema = z.object({
  id: z.coerce.number(),
  file: z.instanceof(File),
});
