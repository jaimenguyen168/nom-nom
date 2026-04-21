ALTER TABLE "recipe_comments" RENAME COLUMN "parent_comment_id" TO "review_id";--> statement-breakpoint
ALTER TABLE "recipe_comment_likes" DROP CONSTRAINT "comment_like_unique";--> statement-breakpoint
ALTER TABLE "recipe_comments" ADD CONSTRAINT "recipe_comments_review_id_recipe_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."recipe_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipe_comments_review_idx" ON "recipe_comments" USING btree ("review_id");--> statement-breakpoint
ALTER TABLE "recipe_comments" DROP COLUMN "likes_count";--> statement-breakpoint
ALTER TABLE "recipe_comment_likes" ADD CONSTRAINT "recipe_comment_like_unique" UNIQUE("user_id","comment_id");