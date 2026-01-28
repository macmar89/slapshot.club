import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "countries" (
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar NOT NULL,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "countries_locales" (
        "name" varchar NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "_locale" "_locales" NOT NULL,
        "_parent_id" integer NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "regions" (
        "id" serial PRIMARY KEY NOT NULL,
        "country_id" integer NOT NULL,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "regions_locales" (
        "name" varchar NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "_locale" "_locales" NOT NULL,
        "_parent_id" integer NOT NULL
    );
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_locales' AND column_name='location_country_id') THEN
        ALTER TABLE "users_locales" ADD COLUMN "location_country_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_locales' AND column_name='location_region_id') THEN
        ALTER TABLE "users_locales" ADD COLUMN "location_region_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' AND column_name='countries_id') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "countries_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' AND column_name='regions_id') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'countries_locales_parent_id_fk') THEN
        ALTER TABLE "countries_locales" ADD CONSTRAINT "countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'regions_country_id_countries_id_fk') THEN
        ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'regions_locales_parent_id_fk') THEN
        ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'countries_updated_at_idx') THEN
        CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'countries_created_at_idx') THEN
        CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'countries_locales_locale_parent_id_unique') THEN
        CREATE UNIQUE INDEX "countries_locales_locale_parent_id_unique" ON "countries_locales" USING btree ("_locale","_parent_id");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'regions_country_idx') THEN
        CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'regions_updated_at_idx') THEN
        CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'regions_created_at_idx') THEN
        CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'regions_locales_locale_parent_id_unique') THEN
        CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_locales_location_country_id_countries_id_fk') THEN
        ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_country_id_countries_id_fk" FOREIGN KEY ("location_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_locales_location_region_id_regions_id_fk') THEN
        ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_region_id_regions_id_fk" FOREIGN KEY ("location_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'payload_locked_documents_rels_countries_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'payload_locked_documents_rels_regions_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_location_location_country_idx') THEN
        CREATE INDEX "users_location_location_country_idx" ON "users_locales" USING btree ("location_country_id");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_location_location_region_idx') THEN
        CREATE INDEX "users_location_location_region_idx" ON "users_locales" USING btree ("location_region_id");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'payload_locked_documents_rels_countries_id_idx') THEN
        CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'payload_locked_documents_rels_regions_id_idx') THEN
        CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_locales' AND column_name='location_country') THEN
        ALTER TABLE "users_locales" DROP COLUMN "location_country";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_locales' AND column_name='location_region') THEN
        ALTER TABLE "users_locales" DROP COLUMN "location_region";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_location_country') THEN
        DROP TYPE "public"."enum_users_location_country";
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Omitted for brevity as we are just fixing the up migration
}
