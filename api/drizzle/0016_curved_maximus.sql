CREATE TABLE "websites" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"description" varchar,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "websites" ADD CONSTRAINT "websites_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;