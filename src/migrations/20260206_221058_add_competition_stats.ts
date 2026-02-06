import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Enums (Postgres 12+ supports IF NOT EXISTS for ADD VALUE)
   ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'update-leaderboards';
   ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'update-leaderboards';
  
   -- Ensure stats columns exist (idempotent)
   ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "total_played_matches" numeric DEFAULT 0;
   ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "total_possible_points" numeric DEFAULT 0;
   ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "recalculation_hour" numeric DEFAULT 5;
   ALTER TABLE "leaderboard_entries" ADD COLUMN IF NOT EXISTS "ovr" numeric;
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "competition_snapshots_id" varchar;

   CREATE TABLE IF NOT EXISTS "competition_snapshots" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"competition_id" varchar NOT NULL,
  	"user_id" varchar NOT NULL,
  	"rank" numeric NOT NULL,
  	"ovr" numeric NOT NULL,
  	"points" numeric NOT NULL,
  	"exact_guesses" numeric DEFAULT 0,
  	"winner_diff" numeric DEFAULT 0,
  	"winner" numeric DEFAULT 0,
  	"adjacent" numeric DEFAULT 0,
  	"total_tips" numeric DEFAULT 0,
  	"date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  -- Indexes (IF NOT EXISTS)
  CREATE INDEX IF NOT EXISTS "competition_snapshots_competition_idx" ON "competition_snapshots" USING btree ("competition_id");
  CREATE INDEX IF NOT EXISTS "competition_snapshots_user_idx" ON "competition_snapshots" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "competition_snapshots_updated_at_idx" ON "competition_snapshots" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "competition_snapshots_created_at_idx" ON "competition_snapshots" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "competition_date_idx" ON "competition_snapshots" USING btree ("competition_id","date");
  CREATE INDEX IF NOT EXISTS "user_competition_1_idx" ON "competition_snapshots" USING btree ("user_id","competition_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_competition_snapshots_id_idx" ON "payload_locked_documents_rels" USING btree ("competition_snapshots_id");

  -- Constraints (Wrap in DO blocks to avoid errors if they exist)
  DO $$ BEGIN
    ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "competition_snapshots" ADD CONSTRAINT "competition_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competition_snapshots_fk" FOREIGN KEY ("competition_snapshots_id") REFERENCES "public"."competition_snapshots"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- Populate stats
  WITH stats AS (
      SELECT
        m.competition_id,
        COUNT(CASE WHEN m.status = 'finished' THEN 1 END) as played,
        COUNT(CASE WHEN m.status IN ('scheduled', 'live', 'finished') THEN 1 END) * 5 as possible
      FROM matches m
      GROUP BY m.competition_id
    )
    UPDATE competitions c
    SET
      total_played_matches = s.played,
      total_possible_points = s.possible
    FROM stats s
    WHERE c.id = s.competition_id;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "competition_snapshots" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "competition_snapshots" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_competition_snapshots_fk";
  
  -- Reverting changes
  ALTER TABLE "competitions" DROP COLUMN IF EXISTS "total_played_matches";
  ALTER TABLE "competitions" DROP COLUMN IF EXISTS "total_possible_points";

  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'update-matches');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'update-matches');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "payload_locked_documents_rels_competition_snapshots_id_idx";
  ALTER TABLE "competitions" DROP COLUMN "recalculation_hour";
  ALTER TABLE "leaderboard_entries" DROP COLUMN "ovr";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "competition_snapshots_id";`)
}
