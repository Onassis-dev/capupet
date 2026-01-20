import { Hono } from "hono";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { organizations } from "../../db/auth.db";
import { type Permission, permissions } from "../../db/auth.db";
import { eq } from "drizzle-orm";
import { type Variables } from "../../index";
import { validator } from "../../middleware/validation.middleware";
import Stripe from "stripe";
import { sendError } from "../../lib/errors";
import { createOrgSchema } from "./organizations.schema";
import { users } from "../../db/auth.db";

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
      inventory: true,
      finances: true,
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

  .put("/", validator("json", createOrgSchema), async (c) => {
    const data = c.req.valid("json");
    const stripe = new Stripe(process.env.STRIPE_API_KEY!);

    try {
      await db.transaction(async (tx) => {
        const [organization] = await tx
          .update(organizations)
          .set({
            name: data.name,
          })
          .where(eq(organizations.id, c.get("orgId")))
          .returning({ subscriptionId: organizations.subscriptionId });

        if (!organization?.subscriptionId) return;

        await stripe.subscriptions.update(organization.subscriptionId, {
          description: data.name,
        });
      });
    } catch (error: any) {
      if (error.cause.constraint === "organizations_name_unique")
        return sendError(c, "nameTaken");
      throw error;
    }

    return c.json({});
  });
