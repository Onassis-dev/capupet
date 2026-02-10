CREATE TYPE "public"."medicalTypes" AS ENUM('vaccine', 'procedure');--> statement-breakpoint
CREATE TABLE "medical" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"date" date NOT NULL,
	"notes" text,
	"medicalOptionId" integer NOT NULL,
	"petId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicalOptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"type" "medicalTypes" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"fts" varchar GENERATED ALWAYS AS (concat_fts("medicalOptions"."name", "medicalOptions"."description")) STORED,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "procedures" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vaccines" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "procedures" CASCADE;--> statement-breakpoint
DROP TABLE "vaccines" CASCADE;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "petId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "petId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "petId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medical" ADD CONSTRAINT "medical_medicalOptionId_medicalOptions_id_fk" FOREIGN KEY ("medicalOptionId") REFERENCES "public"."medicalOptions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical" ADD CONSTRAINT "medical_petId_pets_id_fk" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicalOptions" ADD CONSTRAINT "medicalOptions_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;