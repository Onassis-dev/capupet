import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, eq } from "drizzle-orm";
import { type Variables } from "../..";
import { deleteSchema } from "../../lib/schemas";
import { handleImage } from "../../lib/files";
import { s3 } from "../../lib/s3";
import { images } from "../../db/images.db";
import {
  deleteImageSchema,
  selectImagesSchema,
  uploadImageSchema,
} from "./images.schema";
import { randomUUIDv7 } from "bun";
import { pets } from "../../db/pets.db";

export const imagesRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", selectImagesSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        id: images.id,
        url: images.url,
      })
      .from(images)
      .leftJoin(pets, eq(images.petId, pets.id))
      .where(
        and(
          eq(pets.organizationId, c.get("orgId")),
          eq(images.petId, data.petId)
        )
      )
      .orderBy(images.id);

    return c.json(
      rows.map((row) => ({
        id: row.id,
        url: s3.presign(row.url),
      }))
    );
  })

  .post("/", validator("form", uploadImageSchema), async (c) => {
    const data = c.req.valid("form");

    const [pet] = await db
      .select()
      .from(pets)
      .where(
        and(eq(pets.id, data.petId), eq(pets.organizationId, c.get("orgId")))
      );
    if (!pet) return c.json({ error: "Pet not found" }, 404);

    const image = await handleImage({
      file: data.file,
      imgSize: 500,
      quality: 85,
      transparent: false,
    });
    if (!image) return c.json({ error: "Failed to process image" }, 400);

    const url = `images/${randomUUIDv7()}.${image?.mimetype?.split("/")[1]}`;
    await s3.write(url, image?.buffer);

    await db.insert(images).values({
      petId: data.petId,
      url,
    });

    return c.json({
      url: s3.presign(url),
    });
  })

  .delete("/", validator("json", deleteImageSchema), async (c) => {
    const data = c.req.valid("json");

    const url = new URL(data.url).pathname.split("/").slice(2).join("/");

    const [image] = await db
      .select({
        url: images.url,
        petId: pets.id,
      })
      .from(images)
      .leftJoin(pets, eq(images.petId, pets.id))
      .where(and(eq(images.url, url), eq(pets.organizationId, c.get("orgId"))));
    if (!image) return c.json({ error: "Image not found" }, 404);

    await s3.delete(image.url);

    await db.delete(images).where(and(eq(images.url, url)));

    return c.json({});
  });
