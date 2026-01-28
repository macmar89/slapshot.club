import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_location_country') THEN
        CREATE TYPE "public"."enum_users_location_country" AS ENUM('SK', 'CZ', 'other');
      END IF;
    END $$;
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location_country') THEN
        ALTER TABLE "users" ADD COLUMN "location_country" "enum_users_location_country";
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location_region') THEN
        ALTER TABLE "users" ADD COLUMN "location_region" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "location_country";
  ALTER TABLE "users" DROP COLUMN "location_region";
  DROP TYPE "public"."enum_users_location_country";`)
}
