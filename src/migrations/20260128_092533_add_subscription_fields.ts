import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_subscription_plan" AS ENUM('free', 'pro', 'vip');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_subscription_plan_type" AS ENUM('seasonal', 'lifetime');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_plan" "enum_users_subscription_plan" DEFAULT 'free' NOT NULL;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_plan_type" "enum_users_subscription_plan_type" DEFAULT 'seasonal' NOT NULL;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_active_from" timestamp(3) with time zone;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_active_until" timestamp(3) with time zone;

    CREATE INDEX IF NOT EXISTS "users_subscription_subscription_active_until_idx" ON "users" USING btree ("subscription_active_until");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "subscription_plan";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "subscription_plan_type";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "subscription_active_from";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "subscription_active_until";
    
    DROP TYPE IF EXISTS "public"."enum_users_subscription_plan";
    DROP TYPE IF EXISTS "public"."enum_users_subscription_plan_type";
  `)
}
