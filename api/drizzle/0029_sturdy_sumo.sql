ALTER TABLE "permissions" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "invitation" uuid;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN "inventory";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN "finances";--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_invitation_unique" UNIQUE("invitation");