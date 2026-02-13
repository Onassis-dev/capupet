import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { db } from "../../lib/db";
import { and, eq } from "drizzle-orm";
import { type Variables } from "../..";
import { getInvitationSchema } from "./invitation.schema";
import { organizations, permissions } from "../../db/auth.db";
import { auth } from "../../lib/auth";

export const invitationsRoute = new Hono<{ Variables: Variables }>().get(
  "/",
  validator("query", getInvitationSchema),
  async (c) => {
    const data = c.req.valid("query");

    const [invitation] = await db
      .select({
        name: organizations.name,
        id: organizations.id,
      })
      .from(permissions)
      .leftJoin(organizations, eq(permissions.organizationId, organizations.id))
      .where(eq(permissions.invitation, data.id));

    if (!invitation) return c.json(null);

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    let alreadyRegistered = false;

    if (session) {
      const [permission] = await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(
          and(
            eq(permissions.organizationId, invitation.id!),
            eq(permissions.userId, session?.user.id)
          )
        );
      if (permission) alreadyRegistered = true;
    }

    return c.json({
      organization: invitation.name,
      logged: Boolean(session),
      alreadyRegistered,
    });
  }
);
