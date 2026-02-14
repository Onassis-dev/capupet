import { Hono } from "hono";
import { validator } from "../../middleware/validation.middleware";
import { db } from "../../lib/db";
import { and, eq, sql } from "drizzle-orm";
import {
  publicPetSchema,
  publicPetsSchema,
  publicWebsiteSchema,
} from "./public.schema";
import { websites } from "../../db/websites.db";
import { organizations } from "../../db/auth.db";
import { pets } from "../../db/pets.db";
import { s3 } from "bun";

export const publicRoute = new Hono()
  .get("/website", validator("query", publicWebsiteSchema), async (c) => {
    const data = c.req.valid("query");

    console.time("website");
    const [website] = await db
      .select({
        title: organizations.name,
        lang: websites.language,
        description: websites.description,
        image: organizations.logo,
        style: websites.style,
        color: websites.color,
        city: websites.city,
        instagram: websites.instagram,
        facebook: websites.facebook,
        youtube: websites.youtube,
        email: websites.email,
        website: websites.website,
        phone: websites.phone,
        countryCode: websites.countryCode,
        contactOption: websites.contactOption,
      })
      .from(websites)
      .innerJoin(organizations, eq(websites.organizationId, organizations.id))
      .where(and(eq(websites.slug, data.slug), eq(websites.active, true)));

    if (!website) return c.json({}, 404);

    if (website?.image) website.image = s3.presign(website.image);
    console.timeEnd("website");

    if (!website) return c.json({}, 404);
    return c.json(website);
  })

  .get("/pets", validator("query", publicPetsSchema), async (c) => {
    const data = c.req.valid("query");

    console.time("pets");
    const petsArray = await db
      .select({
        count: sql<number>`count(*) OVER()::integer as count`,
        id: pets.id,
        name: pets.name,
        image: pets.image,
        sex: pets.sex,
      })
      .from(pets)
      .where(
        and(
          eq(
            pets.organizationId,
            sql`(select "organizationId" from websites where slug = ${data.slug})`
          ),
          eq(pets.public, true),
          eq(pets.status, "available"),
          data.species ? eq(pets.species, data.species) : undefined
        )
      )
      .limit(12)
      .offset((data.page - 1) * 12);
    console.timeEnd("pets");

    return c.json(
      petsArray.map((pet) => ({
        ...pet,
        image: pet.image ? s3.presign(pet.image) : null,
      }))
    );
  })

  .get("/pet", validator("query", publicPetSchema), async (c) => {
    const data = c.req.valid("query");

    console.time("pet");
    const [website] = await db
      .select({
        title: organizations.name,
        lang: websites.language,
        image: organizations.logo,
        color: websites.color,
        style: websites.style,
        city: websites.city,
        contactOption: websites.contactOption,
        countryCode: websites.countryCode,
        phone: websites.phone,
        email: websites.email,
        website: websites.website,
        instagram: websites.instagram,
        facebook: websites.facebook,
        youtube: websites.youtube,
        pet: sql<
          typeof pets.$inferSelect & { images: string[] }
        >`(select json_build_object(
        'id', ${pets.id},
        'name', ${pets.name},
        'description', ${pets.publicDescription},
        'sex', ${pets.sex},
        'size', ${pets.size},
        'weight', ${pets.weight},
        'measurement', ${pets.measurement},
        'bornDate', ${pets.bornDate},
        'image', ${pets.image},
        'images', COALESCE((SELECT array_agg(url) FROM images WHERE images."petId" = ${pets.id}), '{}'))
        FROM ${pets} 
        WHERE ${pets.organizationId} = ${websites.organizationId} 
        AND ${pets.id} = ${data.id}
        AND ${pets.public} = true
        AND ${pets.status} = 'available'
        )`,
      })
      .from(websites)
      .innerJoin(organizations, eq(websites.organizationId, organizations.id))
      .where(and(eq(websites.slug, data.slug), eq(websites.active, true)));

    if (!website) return c.json({}, 404);

    if (website.image) website.image = s3.presign(website.image);
    if (website.pet?.image) website.pet.image = s3.presign(website.pet.image);
    if (website.pet?.images) {
      website.pet.images = website.pet.images.map((image: string) =>
        s3.presign(image)
      );
    }
    console.timeEnd("pet");
    return c.json(website);
  });
