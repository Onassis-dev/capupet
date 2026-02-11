import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import {
  createPermissionSchema,
  editPermissionSchema,
  selectPermissionsSchema,
} from "./permissions.schema";
import { permissions, users } from "../../db/auth.db";
import { randomUUIDv7 } from "bun";
import { deleteSchema } from "../../lib/schemas";

export const permissionsRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("users"))

  .get("/", validator("query", selectPermissionsSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        ...getTableColumns(permissions),
        name: users.name,
        email: users.email,
        count: sql<number>`count(*) OVER()::integer as count`,
      })
      .from(permissions)
      .leftJoin(users, eq(permissions.userId, users.id))
      .where(
        and(
          eq(permissions.organizationId, c.get("orgId")),
          data.name
            ? ilike(users.fts, `%${data.name.toLowerCase()}%`)
            : undefined
        )
      )
      .limit(10)
      .offset((data.page - 1) * 10)
      .orderBy(desc(permissions.id));

    return c.json(rows);
  })

  .post("/", validator("json", createPermissionSchema), async (c) => {
    const data = c.req.valid("json");

    await db.insert(permissions).values({
      ...data,
      organizationId: c.get("orgId"),
      invitation: randomUUIDv7(),
    });

    return c.json({});
  })

  .put("/", validator("json", editPermissionSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .update(permissions)
      .set(data)
      .where(
        and(
          eq(permissions.id, data.id),
          eq(permissions.organizationId, c.get("orgId"))
        )
      );

    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .delete(permissions)
      .where(
        and(
          eq(permissions.id, data.id),
          eq(permissions.organizationId, c.get("orgId"))
        )
      );

    return c.json({});
  });
