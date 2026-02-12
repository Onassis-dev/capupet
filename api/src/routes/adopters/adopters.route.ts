import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import { getTableColumns } from "drizzle-orm";
import {
  createAdopterSchema,
  searchAdoptersSchema,
  updateAdopterSchema,
} from "./adopters.schema";
import { adopters } from "../../db/adopters.db";
import { deleteSchema } from "../../lib/schemas";
import { sendError } from "../../lib/errors";

export const adoptersRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("adopters"))

  .get("/", validator("query", searchAdoptersSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        ...getTableColumns(adopters),
        count: sql<number>`count(*) OVER()::integer as count`,
      })
      .from(adopters)
      .where(
        and(
          eq(adopters.organizationId, c.get("orgId")),
          data.text
            ? ilike(adopters.fts, `%${data.text.toLowerCase()}%`)
            : undefined
        )
      )
      .limit(10)
      .offset((data.page - 1) * 10)
      .orderBy(adopters.id);

    return c.json({
      rows,
      count: rows[0]?.count || 0,
    });
  })

  .post("/", validator("json", createAdopterSchema), async (c) => {
    const data = c.req.valid("json");

    await db.insert(adopters).values({
      ...data,
      organizationId: c.get("orgId"),
    });

    return c.json({});
  })

  .put("/", validator("json", updateAdopterSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(adopters)
      .set(data)
      .where(
        and(
          eq(adopters.id, data.id),
          eq(adopters.organizationId, c.get("orgId"))
        )
      );

    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    try {
      await db
        .delete(adopters)
        .where(
          and(
            eq(adopters.id, data.id),
            eq(adopters.organizationId, c.get("orgId"))
          )
        );
    } catch (error: any) {
      if (error?.cause?.constraint) return sendError(c, "existingDependencies");
      else throw error;
    }

    return c.json({});
  });
