import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'enum_feedback_type' AND e.enumlabel = 'custom_country_request') THEN
        ALTER TYPE "public"."enum_feedback_type" ADD VALUE 'custom_country_request' BEFORE 'other';
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "users_locales" (
        "location_country" "enum_users_location_country",
        "location_custom_country" varchar,
        "location_region" varchar,
        "id" serial PRIMARY KEY NOT NULL,
        "_locale" "_locales" NOT NULL,
        "_parent_id" varchar NOT NULL
    );
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_locales_parent_id_fk') THEN
        ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_locales_locale_parent_id_unique') THEN
        CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location_country') THEN
        ALTER TABLE "users" DROP COLUMN "location_country";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location_region') THEN
        ALTER TABLE "users" DROP COLUMN "location_region";
      END IF;
    END $$;
  `)
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
