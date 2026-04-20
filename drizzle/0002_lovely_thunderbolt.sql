CREATE TABLE "recipe_comment_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "comment_like_unique" UNIQUE("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_review_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"review_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "review_like_unique" UNIQUE("user_id","review_id")
);
--> statement-breakpoint
ALTER TABLE "recipe_comment_likes" ADD CONSTRAINT "recipe_comment_likes_comment_id_recipe_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."recipe_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_comment_likes" ADD CONSTRAINT "recipe_comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_review_likes" ADD CONSTRAINT "recipe_review_likes_review_id_recipe_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."recipe_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_review_likes" ADD CONSTRAINT "recipe_review_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;