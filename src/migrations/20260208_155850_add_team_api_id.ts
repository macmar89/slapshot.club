import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ 
    BEGIN 
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='api_hockey_team_id') THEN
        ALTER TABLE "teams" RENAME COLUMN "api_hockey_team_id" TO "api_hockey_id";
      ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='api_hockey_id') THEN
        ALTER TABLE "teams" ADD COLUMN "api_hockey_id" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "teams" DROP COLUMN IF EXISTS "api_hockey_id";
  `)
}
