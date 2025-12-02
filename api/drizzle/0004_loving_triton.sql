CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"done" boolean DEFAULT false,
	"due" timestamp,
	"allDay" boolean DEFAULT false,
	"fts" varchar GENERATED ALWAYS AS (concat_fts("tasks"."title", "tasks"."description")) STORED,
	"organizationId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;