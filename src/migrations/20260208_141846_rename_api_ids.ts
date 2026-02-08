import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "api_hockey_id" varchar;
    
    -- Rename if exists, otherwise it might fail, but since push detected it, it should be there.
    -- If it was already renamed by push, this might fail, but usually migrations run on a state before push.
    DO $$ 
    BEGIN 
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='api_hockey_team_id') THEN
        ALTER TABLE "teams" RENAME COLUMN "api_hockey_team_id" TO "api_hockey_id";
      END IF;
    END $$;

    ALTER TABLE "matches" ADD COLUMN IF NOT EXISTS "ranked_at" timestamp(3) with time zone;
    ALTER TABLE "matches" ADD COLUMN IF NOT EXISTS "api_hockey_id" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "competitions" DROP COLUMN IF EXISTS "api_hockey_id";
    ALTER TABLE "teams" RENAME COLUMN "api_hockey_id" TO "api_hockey_team_id";
    ALTER TABLE "matches" DROP COLUMN IF EXISTS "ranked_at";
    ALTER TABLE "matches" DROP COLUMN IF EXISTS "api_hockey_id";
  `)
}
