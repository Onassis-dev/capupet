import { Hono } from "hono";
import { checkPermission } from "../../middleware/auth.middleware";
import { type Variables } from "../..";
import { db } from "../../lib/db";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { permissions } from "../../db/auth.db";
import { users } from "../../db/auth.db";
import { organizations } from "../../db/auth.db";
import { updateOrgSchema } from "./user.schema";
import { validator } from "../../middleware/validation.middleware";
import { sendError } from "../../lib/errors";
import { s3 } from "../../lib/s3";

export const usersRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission())

  .get("/session", async (c) => {
    const userId = c.get("userId");

    const [user] = await db
      .select({
        ...getTableColumns(permissions),
        orgName: organizations.name,
        orgLogo: organizations.logo,
        plan: organizations.plan,
        owner: sql`${organizations.ownerId} = ${userId}`,
        verified: users.emailVerified,
        name: users.name,
        email: users.email,
        lang: users.lang,
      })
      .from(users)
      .leftJoin(permissions, eq(users.permissionId, permissions.id))
      .leftJoin(organizations, eq(organizations.id, permissions.organizationId))
      .where(eq(users.id, userId));

    const availableOrgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        logo: organizations.logo,
      })
      .from(organizations)
      .innerJoin(permissions, eq(organizations.id, permissions.organizationId))
      .where(eq(permissions.userId, userId))
      .orderBy(organizations.name);

    if (user.orgLogo) user.orgLogo = s3.presign(user.orgLogo);
    availableOrgs.forEach((org) => {
      if (org.logo) org.logo = s3.presign(org.logo);
    });

    return c.json({
      user,
      orgs: availableOrgs,
    });
  })

  .put("/org", validator("json", updateOrgSchema), async (c) => {
    const data = c.req.valid("json");

    const [permission] = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.organizationId, data.orgId),
          eq(permissions.userId, c.get("userId"))
        )
      );

    if (!permission) return sendError(c, "noAvailableOrg");

    await db
      .update(users)
      .set({ permissionId: permission.id })
      .where(eq(users.id, c.get("userId")));

    return c.json({});
  });
