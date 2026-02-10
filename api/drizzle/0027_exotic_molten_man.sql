CREATE TABLE "procedures" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"fts" varchar GENERATED ALWAYS AS (concat_fts("procedures"."name", "procedures"."description")) STORED,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vaccines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"fts" varchar GENERATED ALWAYS AS (concat_fts("vaccines"."name", "vaccines"."description")) STORED,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;