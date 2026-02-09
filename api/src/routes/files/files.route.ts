import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { type Variables } from "../..";
import {
  createFileSchema,
  downloadFileSchema,
  selectFilesSchema,
} from "./files.schema";
import { pets } from "../../db/pets.db";
import { deleteSchema } from "../../lib/schemas";
import { files } from "../../db/files.db";
import { randomUUIDv7 } from "bun";
import { s3 } from "../../lib/s3";

export const filesRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", selectFilesSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        id: files.id,
        url: files.url,
        size: files.size,
        name: files.name,
        extension: files.extension,
        createdAt: files.createdAt,
      })
      .from(files)
      .leftJoin(pets, eq(files.petId, pets.id))
      .where(
        and(
          eq(pets.organizationId, c.get("orgId")),
          eq(files.petId, data.petId)
        )
      )
      .orderBy(desc(files.id));

    return c.json(rows);
  })

  .get("/download", validator("query", downloadFileSchema), async (c) => {
    const data = c.req.valid("query");

    const [file] = await db
      .select({ url: files.url })
      .from(files)
      .where(
        and(
          eq(files.id, data.id),
          sql`(select "organizationId" = ${c.get("orgId")} from pets where id = (select "petId" from files where id = ${data.id}))`
        )
      );
    if (!file) return c.json({}, 404);

    return c.redirect(s3.presign(file.url), 302);
  })

  .post("/", validator("form", createFileSchema), async (c) => {
    const data = c.req.valid("form");

    const [pet] = await db
      .select({ id: pets.id })
      .from(pets)
      .where(
        and(eq(pets.id, data.petId), eq(pets.organizationId, c.get("orgId")))
      );
    if (!pet) return c.json({ error: "Pet not found" }, 404);

    const extension = data.file.name.split(".").pop() || "";

    const [file] = await db
      .insert(files)
      .values({
        name: data.file.name.split(".").slice(0, -1).join("."),
        extension: extension,
        url: `files/${data.petId}/${randomUUIDv7()}.${extension}`,
        petId: data.petId,
        size: data.file.size,
      })
      .returning({
        id: files.id,
        name: files.name,
        extension: files.extension,
        url: files.url,
        size: files.size,
        createdAt: files.createdAt,
      });

    await s3.write(file.url, await data.file.arrayBuffer());

    return c.json(file);
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    const [file] = await db
      .delete(files)
      .where(
        and(
          eq(files.id, data.id),
          sql`(select "organizationId" = ${c.get("orgId")} from pets where id = (select "petId" from files where id = ${data.id}))`
        )
      )
      .returning({
        url: files.url,
      });

    if (file) await s3.delete(file.url);

    return c.json({});
  });
