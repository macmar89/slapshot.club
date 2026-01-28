import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_feedback_type" ADD VALUE 'custom_country_request' BEFORE 'other';
  CREATE TABLE "users_locales" (
  	"location_country" "enum_users_location_country",
  	"location_custom_country" varchar,
  	"location_region" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "users" DROP COLUMN "location_country";
  ALTER TABLE "users" DROP COLUMN "location_region";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_locales" CASCADE;
  ALTER TABLE "feedback" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "feedback" ALTER COLUMN "type" SET DEFAULT 'idea'::text;
  DROP TYPE "public"."enum_feedback_type";
  CREATE TYPE "public"."enum_feedback_type" AS ENUM('bug', 'idea', 'change_user_email_request', 'other');
  ALTER TABLE "feedback" ALTER COLUMN "type" SET DEFAULT 'idea'::"public"."enum_feedback_type";
  ALTER TABLE "feedback" ALTER COLUMN "type" SET DATA TYPE "public"."enum_feedback_type" USING "type"::"public"."enum_feedback_type";
  ALTER TABLE "users" ADD COLUMN "location_country" "enum_users_location_country";
  ALTER TABLE "users" ADD COLUMN "location_region" varchar;`)
}
