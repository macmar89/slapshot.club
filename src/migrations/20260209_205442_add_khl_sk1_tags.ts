import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_teams_league_tags" ADD VALUE IF NOT EXISTS 'khl';
    ALTER TYPE "public"."enum_teams_league_tags" ADD VALUE IF NOT EXISTS 'sk1';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Enums in Postgres cannot easily have values removed.
  // We leave it as is to avoid potential data loss or errors.
}
