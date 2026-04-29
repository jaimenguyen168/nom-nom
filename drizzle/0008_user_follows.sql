CREATE TABLE "user_follows" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_follows_pkey" PRIMARY KEY("follower_id","following_id")
);
--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "follows_follower_idx" ON "user_follows" USING btree ("follower_id");
--> statement-breakpoint
CREATE INDEX "follows_following_idx" ON "user_follows" USING btree ("following_id");
