import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'send-push-notification';
    ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'send-push-notification';
    ALTER TABLE "notification_settings" ALTER COLUMN "id" SET DATA TYPE varchar;
    ALTER TABLE "notification_settings" ALTER COLUMN "daily_summary" SET DEFAULT false;
    ALTER TABLE "notification_settings" ALTER COLUMN "match_reminder" SET DEFAULT false;
    ALTER TABLE "notification_settings" ALTER COLUMN "score_change" SET DEFAULT false;
    ALTER TABLE "notification_settings" ALTER COLUMN "match_end" SET DEFAULT false;
    ALTER TABLE "notification_settings" ALTER COLUMN "leaderboard_update" SET DEFAULT false;
    ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "notification_settings_id" SET DATA TYPE varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'update-matches', 'update-realtime-ranking', 'sync-hockey-matches', 'sync-future-matches', 'sync-teams', 'update-leaderboards', 'evaluate-match');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  ALTER TABLE "notification_settings" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "notification_settings" ALTER COLUMN "daily_summary" SET DEFAULT true;
  ALTER TABLE "notification_settings" ALTER COLUMN "match_reminder" SET DEFAULT true;
  ALTER TABLE "notification_settings" ALTER COLUMN "score_change" SET DEFAULT true;
  ALTER TABLE "notification_settings" ALTER COLUMN "match_end" SET DEFAULT true;
  ALTER TABLE "notification_settings" ALTER COLUMN "leaderboard_update" SET DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "notification_settings_id" SET DATA TYPE integer;`)
}
