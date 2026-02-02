import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_jersey_pattern" AS ENUM('stripes', 'bands', 'plain', 'chevrons', 'hoops');
  CREATE TYPE "public"."enum_users_jersey_style" AS ENUM('classic', 'modern');
  CREATE TYPE "public"."enum_badges_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_badges_rarity" AS ENUM('bronze', 'silver', 'gold', 'platinum');
  ALTER TYPE "public"."_locales" ADD VALUE 'cz';
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"badges_id" varchar
  );
  
  CREATE TABLE "badges" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon_type" "enum_badges_icon_type" DEFAULT 'lucide',
  	"icon_lucide" varchar,
  	"icon_media_id" varchar,
  	"weight" numeric DEFAULT 1,
  	"rarity" "enum_badges_rarity" DEFAULT 'bronze',
  	"is_automatic" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "badges_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "badge_media" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'badge',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_badge_url" varchar,
  	"sizes_badge_width" numeric,
  	"sizes_badge_height" numeric,
  	"sizes_badge_mime_type" varchar,
  	"sizes_badge_filesize" numeric,
  	"sizes_badge_filename" varchar
  );
  
  CREATE TABLE "general_settings_locales" (
  	"gdpr_content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "competitions_slug_idx";
  ALTER TABLE "users" ADD COLUMN "gdpr_consent" boolean DEFAULT false NOT NULL;
  ALTER TABLE "users" ADD COLUMN "marketing_consent" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "marketing_consent_date" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "referral_data_referral_code" varchar;
  ALTER TABLE "users" ADD COLUMN "referral_data_referred_by_id" varchar;
  ALTER TABLE "users" ADD COLUMN "referral_data_stats_total_registered" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "referral_data_stats_total_paid" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "jersey_primary_color" varchar DEFAULT '#ef4444';
  ALTER TABLE "users" ADD COLUMN "jersey_secondary_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "users" ADD COLUMN "jersey_pattern" "enum_users_jersey_pattern" DEFAULT 'stripes';
  ALTER TABLE "users" ADD COLUMN "jersey_number" varchar DEFAULT '10';
  ALTER TABLE "users" ADD COLUMN "jersey_style" "enum_users_jersey_style" DEFAULT 'classic';
  ALTER TABLE "competitions" ADD COLUMN "slug" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "badges_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "badge_media_id" varchar;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_badges_fk" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "badges" ADD CONSTRAINT "badges_icon_media_id_badge_media_id_fk" FOREIGN KEY ("icon_media_id") REFERENCES "public"."badge_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "badges_locales" ADD CONSTRAINT "badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "general_settings_locales" ADD CONSTRAINT "general_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."general_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_badges_id_idx" ON "users_rels" USING btree ("badges_id");
  CREATE UNIQUE INDEX "badges_slug_idx" ON "badges" USING btree ("slug");
  CREATE INDEX "badges_icon_media_idx" ON "badges" USING btree ("icon_media_id");
  CREATE INDEX "badges_updated_at_idx" ON "badges" USING btree ("updated_at");
  CREATE INDEX "badges_created_at_idx" ON "badges" USING btree ("created_at");
  CREATE UNIQUE INDEX "badges_locales_locale_parent_id_unique" ON "badges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "badge_media_updated_at_idx" ON "badge_media" USING btree ("updated_at");
  CREATE INDEX "badge_media_created_at_idx" ON "badge_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "badge_media_filename_idx" ON "badge_media" USING btree ("filename");
  CREATE INDEX "badge_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "badge_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "badge_media_sizes_badge_sizes_badge_filename_idx" ON "badge_media" USING btree ("sizes_badge_filename");
  CREATE UNIQUE INDEX "general_settings_locales_locale_parent_id_unique" ON "general_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_referral_data_referred_by_id_users_id_fk" FOREIGN KEY ("referral_data_referred_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badges_fk" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badge_media_fk" FOREIGN KEY ("badge_media_id") REFERENCES "public"."badge_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_referral_data_referral_data_referral_code_idx" ON "users" USING btree ("referral_data_referral_code");
  CREATE INDEX "users_referral_data_referral_data_referred_by_idx" ON "users" USING btree ("referral_data_referred_by_id");
  CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions" USING btree ("slug");
  CREATE INDEX "payload_locked_documents_rels_badges_id_idx" ON "payload_locked_documents_rels" USING btree ("badges_id");
  CREATE INDEX "payload_locked_documents_rels_badge_media_id_idx" ON "payload_locked_documents_rels" USING btree ("badge_media_id");
  ALTER TABLE "competitions_locales" DROP COLUMN "slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "badges_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "badge_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "general_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "badges" CASCADE;
  DROP TABLE "badges_locales" CASCADE;
  DROP TABLE "badge_media" CASCADE;
  DROP TABLE "general_settings_locales" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_referral_data_referred_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_badges_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_badge_media_fk";
  
  ALTER TABLE "users_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "competitions_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "teams_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "announcements_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "countries_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "regions_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('sk', 'en');
  ALTER TABLE "users_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "competitions_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "teams_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "announcements_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "countries_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "regions_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  DROP INDEX "users_referral_data_referral_data_referral_code_idx";
  DROP INDEX "users_referral_data_referral_data_referred_by_idx";
  DROP INDEX "competitions_slug_idx";
  DROP INDEX "payload_locked_documents_rels_badges_id_idx";
  DROP INDEX "payload_locked_documents_rels_badge_media_id_idx";
  ALTER TABLE "competitions_locales" ADD COLUMN "slug" varchar;
  CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions_locales" USING btree ("slug","_locale");
  ALTER TABLE "users" DROP COLUMN "gdpr_consent";
  ALTER TABLE "users" DROP COLUMN "marketing_consent";
  ALTER TABLE "users" DROP COLUMN "marketing_consent_date";
  ALTER TABLE "users" DROP COLUMN "referral_data_referral_code";
  ALTER TABLE "users" DROP COLUMN "referral_data_referred_by_id";
  ALTER TABLE "users" DROP COLUMN "referral_data_stats_total_registered";
  ALTER TABLE "users" DROP COLUMN "referral_data_stats_total_paid";
  ALTER TABLE "users" DROP COLUMN "jersey_primary_color";
  ALTER TABLE "users" DROP COLUMN "jersey_secondary_color";
  ALTER TABLE "users" DROP COLUMN "jersey_pattern";
  ALTER TABLE "users" DROP COLUMN "jersey_number";
  ALTER TABLE "users" DROP COLUMN "jersey_style";
  ALTER TABLE "competitions" DROP COLUMN "slug";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "badges_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "badge_media_id";
  DROP TYPE "public"."enum_users_jersey_pattern";
  DROP TYPE "public"."enum_users_jersey_style";
  DROP TYPE "public"."enum_badges_icon_type";
  DROP TYPE "public"."enum_badges_rarity";`)
}
