import { Hono } from "hono";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { organizations } from "../../db/auth.db";
import { type Permission, permissions } from "../../db/auth.db";
import { eq } from "drizzle-orm";
import { type Variables } from "../../index";
import { validator } from "../../middleware/validation.middleware";
import { sendError } from "../../lib/errors";
import { createOrgSchema, updateOrgSchema } from "./organizations.schema";
import { users } from "../../db/auth.db";
import { handleImage } from "../../lib/files";
import { s3 } from "../../lib/s3";

export const organizationsRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission())

  .post("/", validator("json", createOrgSchema), async (c) => {
    const data = c.req.valid("json");

    const permissionValues: Record<Permission, true> = {
      users: true,
      pets: true,
      adopters: true,
      tasks: true,
      website: true,
    };

    try {
      await db.transaction(async (tx) => {
        const [organization] = await tx
          .insert(organizations)
          .values({
            name: data.name,
            ownerId: c.get("userId"),
          })
          .returning({ id: organizations.id });

        const [permission] = await tx
          .insert(permissions)
          .values({
            organizationId: organization.id,
            userId: c.get("userId"),
            ...permissionValues,
          })
          .returning({ id: permissions.id });

        await tx
          .update(users)
          .set({ permissionId: permission.id })
          .where(eq(users.id, c.get("userId")));
      });
    } catch (error: any) {
      if (error.cause.constraint === "organizations_name_unique")
        return sendError(c, "nameTaken");
      throw error;
    }

    return c.json({});
  })

  .put("/", validator("form", updateOrgSchema), async (c) => {
    const data = c.req.valid("form");

    const file = await handleImage({
      imgSize: 400,
      quality: 85,
      transparent: false,
      file: data.file,
    });

    let url;
    if (file) {
      url = `orgs/${c.get("orgId")}.${file.mimetype.split("/")[1]}`;

      await s3.write(url, file.buffer, {
        type: file.mimetype,
      });
    }

    await db
      .update(organizations)
      .set({
        name: data.name,
        logo: url || undefined,
      })
      .where(eq(organizations.id, c.get("orgId")));

    return c.json({});
  })

  .delete("/logo", async (c) => {
    const [org] = await db
      .select({ logo: organizations.logo })
      .from(organizations)
      .where(eq(organizations.id, c.get("orgId")));
    if (!org?.logo) return sendError(c, null, 404);

    await s3.delete(org.logo);

    await db
      .update(organizations)
      .set({ logo: null })
      .where(eq(organizations.id, c.get("orgId")));

    return c.json({});
  });
