import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { checkPermission } from "../../middleware/auth.middleware";
import { db } from "../../lib/db";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { type Variables } from "../..";
import {
  createPetSchema,
  petGeneralInfoSchema,
  publicPetSchema,
  selectPetsSchema,
  uploadPetImageSchema,
} from "./pets.schema";
import { pets } from "../../db/pets.db";
import { deleteSchema } from "../../lib/schemas";
import { handleImage } from "../../lib/files";
import { s3 } from "../../lib/s3";
import { adopters } from "../../db/adopters.db";

export const petsRoute = new Hono<{ Variables: Variables }>()
  .use(checkPermission("pets"))

  .get("/", validator("query", selectPetsSchema), async (c) => {
    const data = c.req.valid("query");

    const rows = await db
      .select({
        id: pets.id,
        name: pets.name,
        species: pets.species,
        sex: pets.sex,
        status: pets.status,
        count: sql<number>`count(*) OVER()::integer as count`,
      })
      .from(pets)
      .where(
        and(
          eq(pets.organizationId, c.get("orgId")),
          data.name
            ? ilike(pets.fts, `%${data.name.toLowerCase()}%`)
            : undefined
        )
      )
      .limit(10)
      .offset((data.page - 1) * 10)
      .orderBy(desc(pets.id));

    return c.json({
      rows,
      count: rows[0]?.count || 0,
    });
  })

  .get("/adopters", async (c) => {
    const rows = await db
      .select({ id: adopters.id, name: adopters.name })
      .from(adopters)
      .where(eq(adopters.organizationId, c.get("orgId")))
      .orderBy(desc(adopters.id));

    return c.json(rows);
  })

  .post("/image", validator("form", uploadPetImageSchema), async (c) => {
    const data = c.req.valid("form");

    const [pet] = await db
      .select({
        id: pets.id,
      })
      .from(pets)
      .where(
        and(eq(pets.id, data.id), eq(pets.organizationId, c.get("orgId")))
      );
    if (!pet) return c.json({ error: "Pet not found" }, 404);

    const image = await handleImage({
      file: data.file,
      imgSize: 350,
      quality: 85,
      transparent: false,
    });
    if (!image) return c.json({ error: "Failed to process image" }, 400);

    const url = `pets/${pet.id}.${image?.mimetype?.split("/")[1]}`;
    await s3.write(url, image?.buffer);

    await db
      .update(pets)
      .set({
        image: url,
      })
      .where(eq(pets.id, data.id));

    return c.json({
      image: s3.presign(url),
    });
  })

  .post("/", validator("json", createPetSchema), async (c) => {
    const data = c.req.valid("json");

    const [pet] = await db
      .insert(pets)
      .values({
        ...data,
        organizationId: c.get("orgId"),
      })
      .returning({ id: pets.id });

    return c.json(pet);
  })

  .get("/general", validator("query", deleteSchema), async (c) => {
    const data = c.req.valid("query");

    const [pet] = await db
      .select({
        ...getTableColumns(pets),
        images: sql<
          string[]
        >`COALESCE((SELECT array_agg(url) FROM images WHERE images."petId" = pets.id), '{}')`,
      })
      .from(pets)
      .where(
        and(eq(pets.id, data.id), eq(pets.organizationId, c.get("orgId")))
      );

    if (pet?.image) pet.image = s3.presign(pet.image);
    if (pet?.images) pet.images = pet.images.map((image) => s3.presign(image));

    return c.json(pet || null);
  })
  .put("/general", validator("json", petGeneralInfoSchema), async (c) => {
    const data = c.req.valid("json");
    await db
      .update(pets)
      .set({
        ...data,
        adopterId: data.adopterId ? Number(data.adopterId) : null,
      })
      .where(
        and(eq(pets.id, data.id), eq(pets.organizationId, c.get("orgId")))
      );
    return c.json({});
  })

  .put("/public", validator("json", publicPetSchema), async (c) => {
    const data = c.req.valid("json");
    await db
      .update(pets)
      .set(data)
      .where(
        and(eq(pets.id, data.id), eq(pets.organizationId, c.get("orgId")))
      );
    return c.json({});
  })

  .delete("/", validator("json", deleteSchema), async (c) => {
    const data = c.req.valid("json");

    await db
      .delete(pets)
      .where(
        and(eq(pets.id, data.id), eq(pets.organizationId, c.get("orgId")))
      );

    return c.json({});
  });
