import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import { getTableColumns } from "drizzle-orm";
import {
  createTaskSchema,
  completeTaskSchema,
  searchTasksSchema,
  updateTaskSchema,
} from "./tasks.schema";
import { tasks } from "../../db/tasks.db";
import { deleteSchema } from "../../lib/schemas";

export const tasksRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("tasks"))

  .get("/", validator("query", searchTasksSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        ...getTableColumns(tasks),
        count: sql<number>`count(*) OVER()::integer as count`,
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.organizationId, c.get("orgId")),
          eq(tasks.done, data.done),
          data.text
            ? ilike(tasks.fts, `%${data.text.toLowerCase()}%`)
            : undefined
        )
      )
      .limit(10)
      .offset((data.page - 1) * 10)
      .orderBy(tasks.id);

    return c.json({
      rows,
      count: rows[0]?.count || 0,
    });
  })

  .post("/", validator("json", createTaskSchema), async (c) => {
    const data = c.req.valid("json");

    await db.insert(tasks).values({
      ...data,
      organizationId: c.get("orgId"),
    });

    return c.json({});
  })

  .put("/complete", validator("json", completeTaskSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(tasks)
      .set({ done: data.done })
      .where(
        and(eq(tasks.id, data.id), eq(tasks.organizationId, c.get("orgId")))
      );

    return c.json({});
  })

  .put("/", validator("json", updateTaskSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(tasks)
      .set(data)
      .where(
        and(eq(tasks.id, data.id), eq(tasks.organizationId, c.get("orgId")))
      );

    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .delete(tasks)
      .where(
        and(eq(tasks.id, data.id), eq(tasks.organizationId, c.get("orgId")))
      );

    return c.json({});
  });
