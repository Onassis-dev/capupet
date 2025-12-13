ALTER TABLE "images" DROP CONSTRAINT "images_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "petId" integer;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_petId_pets_id_fk" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN "organizationId";