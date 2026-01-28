import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_location_country" AS ENUM('SK', 'CZ', 'other');
  ALTER TABLE "users" ADD COLUMN "location_country" "enum_users_location_country";
  ALTER TABLE "users" ADD COLUMN "location_region" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "location_country";
  ALTER TABLE "users" DROP COLUMN "location_region";
  DROP TYPE "public"."enum_users_location_country";`)
}
