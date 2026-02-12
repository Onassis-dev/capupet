import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import { getTableColumns } from "drizzle-orm";
import {
  createVaccineSchema,
  searchVaccinesSchema,
  updateVaccineSchema,
} from "./vaccines.schema";
import { medicalOptions } from "../../db/medicalOptions";
import { deleteSchema } from "../../lib/schemas";
import { sendError } from "../../lib/errors";

export const vaccinesRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", searchVaccinesSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        ...getTableColumns(medicalOptions),
        count: sql<number>`count(*) OVER()::integer as count`,
      })
      .from(medicalOptions)
      .where(
        and(
          eq(medicalOptions.organizationId, c.get("orgId")),
          eq(medicalOptions.type, "vaccine"),
          data.text
            ? ilike(medicalOptions.fts, `%${data.text.toLowerCase()}%`)
            : undefined
        )
      )
      .limit(10)
      .offset((data.page - 1) * 10)
      .orderBy(medicalOptions.id);

    return c.json({
      rows,
      count: rows[0]?.count || 0,
    });
  })

  .post("/", validator("json", createVaccineSchema), async (c) => {
    const data = c.req.valid("json");

    await db.insert(medicalOptions).values({
      ...data,
      type: "vaccine",
      organizationId: c.get("orgId"),
    });

    return c.json({});
  })

  .put("/", validator("json", updateVaccineSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(medicalOptions)
      .set(data)
      .where(
        and(
          eq(medicalOptions.id, data.id),
          eq(medicalOptions.organizationId, c.get("orgId"))
        )
      );

    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    try {
      await db
        .delete(medicalOptions)
        .where(
          and(
            eq(medicalOptions.id, data.id),
            eq(medicalOptions.organizationId, c.get("orgId"))
          )
        );
    } catch (error: any) {
      if (error?.cause?.constraint) return sendError(c, "existingDependencies");
      else throw error;
    }

    return c.json({});
  });
