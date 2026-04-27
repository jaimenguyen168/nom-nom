CREATE TYPE "public"."cookbook_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."cookbook_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "cookbook_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"cookbook_id" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cookbook_category_unique" UNIQUE("cookbook_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "cookbook_purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"cookbook_id" text NOT NULL,
	"user_id" text NOT NULL,
	"price_paid" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cookbook_purchase_unique" UNIQUE("cookbook_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "cookbook_recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"cookbook_id" text NOT NULL,
	"recipe_id" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"chapter_title" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cookbook_recipe_unique" UNIQUE("cookbook_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "cookbook_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"cookbook_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cookbook_review_unique" UNIQUE("user_id","cookbook_id")
);
--> statement-breakpoint
CREATE TABLE "cookbook_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"cookbook_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cookbooks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"cover_image_url" text,
	"banner_image_url" text,
	"author_id" text NOT NULL,
	"cuisine" varchar(100),
	"difficulty" "cookbook_difficulty",
	"servings_range" varchar(50),
	"language" varchar(50) DEFAULT 'English',
	"edition" varchar(50),
	"published_at" timestamp,
	"is_free" boolean DEFAULT true,
	"price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"status" "cookbook_status" DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cookbook_author_slug_unique" UNIQUE("author_id","slug")
);
--> statement-breakpoint
CREATE TABLE "user_saved_cookbooks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"cookbook_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_saved_cookbook_unique" UNIQUE("user_id","cookbook_id")
);
--> statement-breakpoint
CREATE TABLE "user_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"ai_recipes_used" integer DEFAULT 0 NOT NULL,
	"ai_blogs_used" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_usage_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "cookbook_categories" ADD CONSTRAINT "cookbook_categories_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_categories" ADD CONSTRAINT "cookbook_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_purchases" ADD CONSTRAINT "cookbook_purchases_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_purchases" ADD CONSTRAINT "cookbook_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_recipes" ADD CONSTRAINT "cookbook_recipes_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_recipes" ADD CONSTRAINT "cookbook_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_reviews" ADD CONSTRAINT "cookbook_reviews_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_reviews" ADD CONSTRAINT "cookbook_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_tags" ADD CONSTRAINT "cookbook_tags_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbooks" ADD CONSTRAINT "cookbooks_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_cookbooks" ADD CONSTRAINT "user_saved_cookbooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_cookbooks" ADD CONSTRAINT "user_saved_cookbooks_cookbook_id_cookbooks_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_usage" ADD CONSTRAINT "user_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cookbook_categories_cookbook_idx" ON "cookbook_categories" USING btree ("cookbook_id");--> statement-breakpoint
CREATE INDEX "cookbook_purchases_user_idx" ON "cookbook_purchases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cookbook_purchases_cookbook_idx" ON "cookbook_purchases" USING btree ("cookbook_id");--> statement-breakpoint
CREATE INDEX "cookbook_recipes_cookbook_idx" ON "cookbook_recipes" USING btree ("cookbook_id");--> statement-breakpoint
CREATE INDEX "cookbook_recipes_recipe_idx" ON "cookbook_recipes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "cookbook_reviews_cookbook_idx" ON "cookbook_reviews" USING btree ("cookbook_id");--> statement-breakpoint
CREATE INDEX "cookbook_tags_cookbook_idx" ON "cookbook_tags" USING btree ("cookbook_id");--> statement-breakpoint
CREATE INDEX "cookbooks_author_idx" ON "cookbooks" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "cookbooks_status_idx" ON "cookbooks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cookbooks_is_free_idx" ON "cookbooks" USING btree ("is_free");--> statement-breakpoint
CREATE INDEX "user_saved_cookbooks_user_idx" ON "user_saved_cookbooks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_user_id_idx" ON "user_usage" USING btree ("user_id");