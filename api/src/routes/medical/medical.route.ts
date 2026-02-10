import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { type Variables } from "../..";
import {
  createMedicalSchema,
  editMedicalSchema,
  selectMedicalSchema,
} from "./medical.schema";
import { pets } from "../../db/pets.db";
import { deleteSchema } from "../../lib/schemas";
import { medical } from "../../db/medical.db";
import { medicalOptions } from "../../db/medicalOptions";

export const medicalRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", selectMedicalSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        id: medical.id,
        medicalOptionId: medical.medicalOptionId,
        date: medical.date,
        type: medicalOptions.type,
      })
      .from(medical)
      .leftJoin(pets, eq(medical.petId, pets.id))
      .leftJoin(medicalOptions, eq(medical.medicalOptionId, medicalOptions.id))
      .where(
        and(
          eq(pets.organizationId, c.get("orgId")),
          eq(medical.petId, data.petId)
        )
      )
      .orderBy(desc(medical.id));

    return c.json(rows);
  })

  .get("/options", async (c) => {
    const rows = await db
      .select({
        id: medicalOptions.id,
        name: medicalOptions.name,
        type: medicalOptions.type,
      })
      .from(medicalOptions)
      .where(eq(medicalOptions.organizationId, c.get("orgId")))
      .orderBy(medicalOptions.id);

    return c.json(rows);
  })

  .post("/", validator("json", createMedicalSchema), async (c) => {
    const data = c.req.valid("json");

    const [pet] = await db
      .select({ id: pets.id })
      .from(pets)
      .where(
        and(eq(pets.id, data.petId), eq(pets.organizationId, c.get("orgId")))
      );
    if (!pet) return c.json({ error: "Pet not found" }, 404);

    const [row] = await db
      .insert(medical)
      .values({
        ...data,
      })
      .returning({
        id: medical.id,
      });

    return c.json(row);
  })

  .put("/", validator("json", editMedicalSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(medical)
      .set({
        ...data,
      })
      .where(
        and(
          eq(medical.id, data.id),
          sql`(select "organizationId" = ${c.get("orgId")} from pets where id = (select "petId" from medical where id = ${data.id}))`
        )
      );

    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .delete(medical)
      .where(
        and(
          eq(medical.id, data.id),
          sql`(select "organizationId" = ${c.get("orgId")} from pets where id = (select "petId" from medical where id = ${data.id}))`
        )
      );

    return c.json({});
  });
