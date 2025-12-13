CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;