ALTER TABLE "pets" ADD COLUMN "microchip" varchar;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "adopterId" integer;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_adopterId_adopters_id_fk" FOREIGN KEY ("adopterId") REFERENCES "public"."adopters"("id") ON DELETE restrict ON UPDATE no action;