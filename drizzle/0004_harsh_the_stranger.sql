ALTER TABLE "blog_likes" RENAME TO "blog_review_likes";--> statement-breakpoint
ALTER TABLE "blog_review_likes" RENAME COLUMN "blog_id" TO "review_id";--> statement-breakpoint
ALTER TABLE "blog_review_likes" DROP CONSTRAINT "blog_likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_review_likes" DROP CONSTRAINT "blog_likes_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_review_likes" ADD CONSTRAINT "blog_review_likes_review_id_blog_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."blog_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_review_likes" ADD CONSTRAINT "blog_review_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_review_likes" ADD CONSTRAINT "blog_review_like_unique" UNIQUE("user_id","review_id");