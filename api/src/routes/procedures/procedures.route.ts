import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import { getTableColumns } from "drizzle-orm";
import {
  createProcedureSchema,
  searchProceduresSchema,
  updateProcedureSchema,
} from "./procedures.schema";
import { medicalOptions } from "../../db/medicalOptions";
import { deleteSchema } from "../../lib/schemas";

export const proceduresRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", searchProceduresSchema), async (c) => {
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
          eq(medicalOptions.type, "procedure"),
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

  .post("/", validator("json", createProcedureSchema), async (c) => {
    const data = c.req.valid("json");

    await db.insert(medicalOptions).values({
      ...data,
      organizationId: c.get("orgId"),
      type: "procedure",
    });

    return c.json({});
  })

  .put("/", validator("json", updateProcedureSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(medicalOptions)
      .set({
        ...data,
      })
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

    await db
      .delete(medicalOptions)
      .where(
        and(
          eq(medicalOptions.id, data.id),
          eq(medicalOptions.organizationId, c.get("orgId"))
        )
      );

    return c.json({});
  });
