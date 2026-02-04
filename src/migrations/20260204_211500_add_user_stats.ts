import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_total_predictions" numeric DEFAULT 0;
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_lifetime_points" numeric DEFAULT 0;
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_lifetime_possible_points" numeric DEFAULT 0;
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_current_ovr" numeric DEFAULT 0;
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_max_ovr_ever" numeric DEFAULT 0;

   -- Migrate data from old column to new column (only if old column exists)
   DO $$
   BEGIN
     IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stats_total_points') THEN
        UPDATE "users" SET "stats_lifetime_points" = "stats_total_points";
     END IF;
   END $$;

   -- Drop the old column
   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_total_points";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Restore the old column
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stats_total_points" numeric DEFAULT 0;
   
   -- Restore data
   DO $$
   BEGIN
     IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stats_lifetime_points') THEN
        UPDATE "users" SET "stats_total_points" = "stats_lifetime_points";
     END IF;
   END $$;

   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_total_predictions";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_lifetime_points";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_lifetime_possible_points";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_current_ovr";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "stats_max_ovr_ever";
  `)
}
