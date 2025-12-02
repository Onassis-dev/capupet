ALTER TABLE "permissions" RENAME COLUMN "calendar" TO "tasks";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "due" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "hour" time;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "allDay";