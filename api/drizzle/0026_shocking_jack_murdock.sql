CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" integer,
	"name" text NOT NULL,
	"extension" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"petId" integer
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_petId_pets_id_fk" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;