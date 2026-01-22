import { validator as honoValidator } from "hono/validator";
import { type ValidationTargets } from "hono";
import { type z } from "zod";

function normalize(value: unknown): unknown {
  if (value === "") return null;
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === "object" && value !== null) {
    if (value instanceof File) return value;
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalize(v)])
    );
  }
  return value;
}

export const validator = <
  Target extends keyof ValidationTargets,
  Schema extends z.ZodType,
>(
  target: Target,
  schema: Schema
) =>
  honoValidator(target, async (value, c) => {
    const result = await schema.safeParseAsync(normalize(value));
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }
    return result.data as z.infer<Schema>;
  });
