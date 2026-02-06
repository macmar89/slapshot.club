import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "total_played_matches" numeric DEFAULT 0;
  ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "total_possible_points" numeric DEFAULT 0;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "competitions" DROP COLUMN IF EXISTS "total_played_matches";
  ALTER TABLE "competitions" DROP COLUMN IF EXISTS "total_possible_points";`)
}
