import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "notification_settings" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"daily_summary" boolean DEFAULT false,
  	"match_reminder" boolean DEFAULT false,
  	"score_change" boolean DEFAULT false,
  	"match_end" boolean DEFAULT false,
  	"leaderboard_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "notification_settings_id" varchar;
  
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notification_settings_user_id_users_id_fk') THEN
      ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "notification_settings_user_idx" ON "notification_settings" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "notification_settings_updated_at_idx" ON "notification_settings" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "notification_settings_created_at_idx" ON "notification_settings" USING btree ("created_at");
  
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_notification_settings_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notification_settings_fk" FOREIGN KEY ("notification_settings_id") REFERENCES "public"."notification_settings"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notification_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("notification_settings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "notification_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "notification_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_notification_settings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP INDEX IF EXISTS "payload_locked_documents_rels_notification_settings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "notification_settings_id";`)
}
