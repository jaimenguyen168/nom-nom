ALTER TABLE "user_usage" DROP CONSTRAINT "user_usage_user_id_unique";--> statement-breakpoint
ALTER TABLE "user_usage" ADD CONSTRAINT "usage_user_period_unique" UNIQUE("user_id","period_start");