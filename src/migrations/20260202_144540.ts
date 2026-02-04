import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
   BEGIN
     IF to_regclass('public.users') IS NULL THEN

   CREATE TYPE "public"."_locales" AS ENUM('sk', 'en', 'cz');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_users_preferred_language" AS ENUM('sk', 'en', 'cz');
  CREATE TYPE "public"."enum_users_subscription_plan" AS ENUM('free', 'pro', 'vip');
  CREATE TYPE "public"."enum_users_subscription_plan_type" AS ENUM('seasonal', 'lifetime');
  CREATE TYPE "public"."enum_users_stats_trend" AS ENUM('up', 'down', 'stable');
  CREATE TYPE "public"."enum_users_jersey_pattern" AS ENUM('stripes', 'bands', 'plain', 'chevrons', 'hoops');
  CREATE TYPE "public"."enum_users_jersey_style" AS ENUM('classic', 'modern');
  CREATE TYPE "public"."enum_competitions_status" AS ENUM('upcoming', 'active', 'finished');
  CREATE TYPE "public"."enum_feedback_type" AS ENUM('bug', 'idea', 'change_user_email_request', 'custom_country_request', 'other');
  CREATE TYPE "public"."enum_feedback_status" AS ENUM('new', 'in-progress', 'resolved', 'ignored');
  CREATE TYPE "public"."enum_user_memberships_status" AS ENUM('active', 'pending', 'cancelled', 'expired');
  CREATE TYPE "public"."enum_teams_league_tags" AS ENUM('sk', 'nhl', 'cz', 'iihf');
  CREATE TYPE "public"."enum_teams_type" AS ENUM('club', 'national');
  CREATE TYPE "public"."enum_teams_country" AS ENUM('SVK', 'CZE', 'USA', 'CAN');
  CREATE TYPE "public"."enum_matches_status" AS ENUM('scheduled', 'live', 'finished', 'cancelled');
  CREATE TYPE "public"."enum_matches_result_stage_type" AS ENUM('regular_season', 'group_phase', 'playoffs', 'pre_season');
  CREATE TYPE "public"."enum_matches_result_ending_type" AS ENUM('regular', 'ot', 'so');
  CREATE TYPE "public"."enum_predictions_status" AS ENUM('pending', 'evaluated', 'void');
  CREATE TYPE "public"."enum_leagues_type" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_announcements_targeting_target_roles" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_announcements_icon" AS ENUM('bell', 'trophy', 'star', 'gift', 'alert');
  CREATE TYPE "public"."enum_badges_icon_type" AS ENUM('lucide', 'upload');
  CREATE TYPE "public"."enum_badges_rarity" AS ENUM('bronze', 'silver', 'gold', 'platinum');
  CREATE TABLE "users_seen_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"announcement_id" varchar,
  	"display_count" numeric DEFAULT 1
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"username" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"last_activity" timestamp(3) with time zone,
  	"preferred_language" "enum_users_preferred_language" DEFAULT 'sk',
  	"subscription_plan" "enum_users_subscription_plan" DEFAULT 'free' NOT NULL,
  	"subscription_plan_type" "enum_users_subscription_plan_type" DEFAULT 'seasonal' NOT NULL,
  	"subscription_active_from" timestamp(3) with time zone,
  	"subscription_active_until" timestamp(3) with time zone,
  	"has_seen_onboarding" boolean DEFAULT false,
  	"gdpr_consent" boolean DEFAULT false NOT NULL,
  	"marketing_consent" boolean DEFAULT false,
  	"marketing_consent_date" timestamp(3) with time zone,
  	"stats_total_points" numeric DEFAULT 0,
  	"stats_global_rank" numeric,
  	"stats_previous_rank" numeric,
  	"stats_trend" "enum_users_stats_trend",
  	"referral_data_referral_code" varchar,
  	"referral_data_referred_by_id" varchar,
  	"referral_data_stats_total_registered" numeric DEFAULT 0,
  	"referral_data_stats_total_paid" numeric DEFAULT 0,
  	"jersey_primary_color" varchar DEFAULT '#ef4444',
  	"jersey_secondary_color" varchar DEFAULT '#ffffff',
  	"jersey_pattern" "enum_users_jersey_pattern" DEFAULT 'stripes',
  	"jersey_number" varchar DEFAULT '10',
  	"jersey_style" "enum_users_jersey_style" DEFAULT 'classic',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_locales" (
  	"location_country_id" integer,
  	"location_custom_country" varchar,
  	"location_region_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"badges_id" varchar
  );
  
  CREATE TABLE "media" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "competitions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"banner_id" varchar,
  	"status" "enum_competitions_status" DEFAULT 'upcoming' NOT NULL,
  	"is_registration_open" boolean DEFAULT false,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "competitions_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "competitions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"membership_tiers_id" varchar
  );
  
  CREATE TABLE "feedback" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_feedback_type" DEFAULT 'idea' NOT NULL,
  	"message" varchar NOT NULL,
  	"page_url" varchar,
  	"user_id" varchar,
  	"read" boolean DEFAULT false,
  	"status" "enum_feedback_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "membership_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "membership_tiers" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"rank" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "user_memberships" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"tier_id" varchar NOT NULL,
  	"status" "enum_user_memberships_status" DEFAULT 'active' NOT NULL,
  	"valid_until" timestamp(3) with time zone,
  	"billing_stripe_subscription_id" varchar,
  	"billing_last_payment_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leaderboard_entries" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"competition_id" varchar NOT NULL,
  	"total_points" numeric DEFAULT 0,
  	"total_matches" numeric DEFAULT 0,
  	"exact_guesses" numeric DEFAULT 0,
  	"correct_trends" numeric DEFAULT 0,
  	"correct_diffs" numeric DEFAULT 0,
  	"wrong_guesses" numeric DEFAULT 0,
  	"current_rank" numeric,
  	"previous_rank" numeric,
  	"rank_change" numeric,
  	"active_league_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teams_league_tags" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_teams_league_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "teams" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"type" "enum_teams_type" DEFAULT 'club' NOT NULL,
  	"country" "enum_teams_country",
  	"logo_id" varchar,
  	"colors_primary" varchar DEFAULT '#000000' NOT NULL,
  	"colors_secondary" varchar DEFAULT '#ffffff' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teams_locales" (
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "matches" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"display_title" varchar,
  	"competition_id" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"home_team_id" varchar NOT NULL,
  	"away_team_id" varchar NOT NULL,
  	"status" "enum_matches_status" DEFAULT 'scheduled' NOT NULL,
  	"result_stage_type" "enum_matches_result_stage_type" DEFAULT 'regular_season' NOT NULL,
  	"result_home_score" numeric DEFAULT 0,
  	"result_away_score" numeric DEFAULT 0,
  	"result_ending_type" "enum_matches_result_ending_type" DEFAULT 'regular',
  	"result_round_label" varchar,
  	"result_round_order" numeric,
  	"result_group_name" varchar,
  	"result_series_game_number" numeric,
  	"result_series_state" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "predictions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"match_id" varchar NOT NULL,
  	"home_goals" numeric NOT NULL,
  	"away_goals" numeric NOT NULL,
  	"points" numeric DEFAULT 0,
  	"status" "enum_predictions_status" DEFAULT 'pending',
  	"edit_count" numeric DEFAULT 1,
  	"is_exact" boolean DEFAULT false,
  	"is_trend" boolean DEFAULT false,
  	"is_diff" boolean DEFAULT false,
  	"is_wrong" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leagues" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_leagues_type" DEFAULT 'private' NOT NULL,
  	"code" varchar,
  	"owner_id" varchar NOT NULL,
  	"competition_id" varchar NOT NULL,
  	"max_members" numeric DEFAULT 30 NOT NULL,
  	"stats_average_score" numeric DEFAULT 0,
  	"stats_total_score" numeric DEFAULT 0,
  	"stats_member_count" numeric DEFAULT 1,
  	"stats_rank" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leagues_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar
  );
  
  CREATE TABLE "mini_leagues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"competition_id" varchar NOT NULL,
  	"owner_id" varchar NOT NULL,
  	"invite_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mini_leagues_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar
  );
  
  CREATE TABLE "team_logos" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'team_logo',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "rate_limits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ip" varchar NOT NULL,
  	"count" numeric DEFAULT 0 NOT NULL,
  	"last_request" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcements_targeting_target_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_announcements_targeting_target_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"image_id" varchar,
  	"max_displays_per_user" numeric DEFAULT 1,
  	"targeting_min_points" numeric,
  	"targeting_max_points" numeric,
  	"icon" "enum_announcements_icon" DEFAULT 'bell',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcements_locales" (
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"button_text" varchar DEFAULT 'OK',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"country_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "badges" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon_type" "enum_badges_icon_type" DEFAULT 'lucide',
  	"icon_lucide" varchar,
  	"icon_media_id" varchar,
  	"weight" numeric DEFAULT 1,
  	"rarity" "enum_badges_rarity" DEFAULT 'bronze',
  	"is_automatic" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "badges_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "badge_media" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'badge',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_badge_url" varchar,
  	"sizes_badge_width" numeric,
  	"sizes_badge_height" numeric,
  	"sizes_badge_mime_type" varchar,
  	"sizes_badge_filesize" numeric,
  	"sizes_badge_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar,
  	"media_id" varchar,
  	"competitions_id" varchar,
  	"feedback_id" varchar,
  	"membership_tiers_id" varchar,
  	"user_memberships_id" varchar,
  	"leaderboard_entries_id" varchar,
  	"teams_id" varchar,
  	"matches_id" varchar,
  	"predictions_id" varchar,
  	"leagues_id" varchar,
  	"mini_leagues_id" integer,
  	"team_logos_id" varchar,
  	"rate_limits_id" integer,
  	"announcements_id" integer,
  	"countries_id" integer,
  	"regions_id" integer,
  	"badges_id" varchar,
  	"badge_media_id" varchar
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "general_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "general_settings_locales" (
  	"gdpr_content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_seen_announcements" ADD CONSTRAINT "users_seen_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_referral_data_referred_by_id_users_id_fk" FOREIGN KEY ("referral_data_referred_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_country_id_countries_id_fk" FOREIGN KEY ("location_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_location_region_id_regions_id_fk" FOREIGN KEY ("location_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_locales" ADD CONSTRAINT "users_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_badges_fk" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitions" ADD CONSTRAINT "competitions_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "competitions_locales" ADD CONSTRAINT "competitions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitions_rels" ADD CONSTRAINT "competitions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitions_rels" ADD CONSTRAINT "competitions_rels_membership_tiers_fk" FOREIGN KEY ("membership_tiers_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership_tiers_features" ADD CONSTRAINT "membership_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_tier_id_membership_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."membership_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_active_league_id_leagues_id_fk" FOREIGN KEY ("active_league_id") REFERENCES "public"."leagues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams_league_tags" ADD CONSTRAINT "teams_league_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teams" ADD CONSTRAINT "teams_logo_id_team_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."team_logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams_locales" ADD CONSTRAINT "teams_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "predictions" ADD CONSTRAINT "predictions_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leagues" ADD CONSTRAINT "leagues_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leagues" ADD CONSTRAINT "leagues_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leagues_rels" ADD CONSTRAINT "leagues_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leagues_rels" ADD CONSTRAINT "leagues_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mini_leagues" ADD CONSTRAINT "mini_leagues_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mini_leagues" ADD CONSTRAINT "mini_leagues_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mini_leagues_rels" ADD CONSTRAINT "mini_leagues_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mini_leagues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mini_leagues_rels" ADD CONSTRAINT "mini_leagues_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_targeting_target_roles" ADD CONSTRAINT "announcements_targeting_target_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements_locales" ADD CONSTRAINT "announcements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_locales" ADD CONSTRAINT "countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "badges" ADD CONSTRAINT "badges_icon_media_id_badge_media_id_fk" FOREIGN KEY ("icon_media_id") REFERENCES "public"."badge_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "badges_locales" ADD CONSTRAINT "badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitions_fk" FOREIGN KEY ("competitions_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_membership_tiers_fk" FOREIGN KEY ("membership_tiers_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_memberships_fk" FOREIGN KEY ("user_memberships_id") REFERENCES "public"."user_memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leaderboard_entries_fk" FOREIGN KEY ("leaderboard_entries_id") REFERENCES "public"."leaderboard_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_matches_fk" FOREIGN KEY ("matches_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_predictions_fk" FOREIGN KEY ("predictions_id") REFERENCES "public"."predictions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leagues_fk" FOREIGN KEY ("leagues_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mini_leagues_fk" FOREIGN KEY ("mini_leagues_id") REFERENCES "public"."mini_leagues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_logos_fk" FOREIGN KEY ("team_logos_id") REFERENCES "public"."team_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limits_fk" FOREIGN KEY ("rate_limits_id") REFERENCES "public"."rate_limits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badges_fk" FOREIGN KEY ("badges_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_badge_media_fk" FOREIGN KEY ("badge_media_id") REFERENCES "public"."badge_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "general_settings" ADD CONSTRAINT "general_settings_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "general_settings_locales" ADD CONSTRAINT "general_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."general_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_seen_announcements_order_idx" ON "users_seen_announcements" USING btree ("_order");
  CREATE INDEX "users_seen_announcements_parent_id_idx" ON "users_seen_announcements" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "users_subscription_subscription_active_until_idx" ON "users" USING btree ("subscription_active_until");
  CREATE INDEX "users_stats_stats_total_points_idx" ON "users" USING btree ("stats_total_points");
  CREATE INDEX "users_stats_stats_global_rank_idx" ON "users" USING btree ("stats_global_rank");
  CREATE UNIQUE INDEX "users_referral_data_referral_data_referral_code_idx" ON "users" USING btree ("referral_data_referral_code");
  CREATE INDEX "users_referral_data_referral_data_referred_by_idx" ON "users" USING btree ("referral_data_referred_by_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_location_location_country_idx" ON "users_locales" USING btree ("location_country_id");
  CREATE INDEX "users_location_location_region_idx" ON "users_locales" USING btree ("location_region_id");
  CREATE UNIQUE INDEX "users_locales_locale_parent_id_unique" ON "users_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_badges_id_idx" ON "users_rels" USING btree ("badges_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "competitions_slug_idx" ON "competitions" USING btree ("slug");
  CREATE INDEX "competitions_banner_idx" ON "competitions" USING btree ("banner_id");
  CREATE INDEX "competitions_updated_at_idx" ON "competitions" USING btree ("updated_at");
  CREATE INDEX "competitions_created_at_idx" ON "competitions" USING btree ("created_at");
  CREATE UNIQUE INDEX "competitions_locales_locale_parent_id_unique" ON "competitions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "competitions_rels_order_idx" ON "competitions_rels" USING btree ("order");
  CREATE INDEX "competitions_rels_parent_idx" ON "competitions_rels" USING btree ("parent_id");
  CREATE INDEX "competitions_rels_path_idx" ON "competitions_rels" USING btree ("path");
  CREATE INDEX "competitions_rels_membership_tiers_id_idx" ON "competitions_rels" USING btree ("membership_tiers_id");
  CREATE INDEX "feedback_user_idx" ON "feedback" USING btree ("user_id");
  CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at");
  CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");
  CREATE INDEX "membership_tiers_features_order_idx" ON "membership_tiers_features" USING btree ("_order");
  CREATE INDEX "membership_tiers_features_parent_id_idx" ON "membership_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "membership_tiers_updated_at_idx" ON "membership_tiers" USING btree ("updated_at");
  CREATE INDEX "membership_tiers_created_at_idx" ON "membership_tiers" USING btree ("created_at");
  CREATE INDEX "user_memberships_user_idx" ON "user_memberships" USING btree ("user_id");
  CREATE INDEX "user_memberships_tier_idx" ON "user_memberships" USING btree ("tier_id");
  CREATE INDEX "user_memberships_valid_until_idx" ON "user_memberships" USING btree ("valid_until");
  CREATE INDEX "user_memberships_updated_at_idx" ON "user_memberships" USING btree ("updated_at");
  CREATE INDEX "user_memberships_created_at_idx" ON "user_memberships" USING btree ("created_at");
  CREATE INDEX "leaderboard_entries_user_idx" ON "leaderboard_entries" USING btree ("user_id");
  CREATE INDEX "leaderboard_entries_competition_idx" ON "leaderboard_entries" USING btree ("competition_id");
  CREATE INDEX "leaderboard_entries_total_points_idx" ON "leaderboard_entries" USING btree ("total_points");
  CREATE INDEX "leaderboard_entries_total_matches_idx" ON "leaderboard_entries" USING btree ("total_matches");
  CREATE INDEX "leaderboard_entries_current_rank_idx" ON "leaderboard_entries" USING btree ("current_rank");
  CREATE INDEX "leaderboard_entries_active_league_idx" ON "leaderboard_entries" USING btree ("active_league_id");
  CREATE INDEX "leaderboard_entries_updated_at_idx" ON "leaderboard_entries" USING btree ("updated_at");
  CREATE INDEX "leaderboard_entries_created_at_idx" ON "leaderboard_entries" USING btree ("created_at");
  CREATE INDEX "competition_totalPoints_idx" ON "leaderboard_entries" USING btree ("competition_id","total_points");
  CREATE UNIQUE INDEX "user_competition_idx" ON "leaderboard_entries" USING btree ("user_id","competition_id");
  CREATE INDEX "teams_league_tags_order_idx" ON "teams_league_tags" USING btree ("order");
  CREATE INDEX "teams_league_tags_parent_idx" ON "teams_league_tags" USING btree ("parent_id");
  CREATE INDEX "teams_logo_idx" ON "teams" USING btree ("logo_id");
  CREATE INDEX "teams_updated_at_idx" ON "teams" USING btree ("updated_at");
  CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");
  CREATE UNIQUE INDEX "teams_locales_locale_parent_id_unique" ON "teams_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "matches_competition_idx" ON "matches" USING btree ("competition_id");
  CREATE INDEX "matches_home_team_idx" ON "matches" USING btree ("home_team_id");
  CREATE INDEX "matches_away_team_idx" ON "matches" USING btree ("away_team_id");
  CREATE INDEX "matches_updated_at_idx" ON "matches" USING btree ("updated_at");
  CREATE INDEX "matches_created_at_idx" ON "matches" USING btree ("created_at");
  CREATE INDEX "predictions_user_idx" ON "predictions" USING btree ("user_id");
  CREATE INDEX "predictions_match_idx" ON "predictions" USING btree ("match_id");
  CREATE INDEX "predictions_updated_at_idx" ON "predictions" USING btree ("updated_at");
  CREATE INDEX "predictions_created_at_idx" ON "predictions" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_match_idx" ON "predictions" USING btree ("user_id","match_id");
  CREATE INDEX "match_idx" ON "predictions" USING btree ("match_id");
  CREATE INDEX "leagues_name_idx" ON "leagues" USING btree ("name");
  CREATE UNIQUE INDEX "leagues_code_idx" ON "leagues" USING btree ("code");
  CREATE INDEX "leagues_owner_idx" ON "leagues" USING btree ("owner_id");
  CREATE INDEX "leagues_competition_idx" ON "leagues" USING btree ("competition_id");
  CREATE INDEX "leagues_updated_at_idx" ON "leagues" USING btree ("updated_at");
  CREATE INDEX "leagues_created_at_idx" ON "leagues" USING btree ("created_at");
  CREATE INDEX "leagues_rels_order_idx" ON "leagues_rels" USING btree ("order");
  CREATE INDEX "leagues_rels_parent_idx" ON "leagues_rels" USING btree ("parent_id");
  CREATE INDEX "leagues_rels_path_idx" ON "leagues_rels" USING btree ("path");
  CREATE INDEX "leagues_rels_users_id_idx" ON "leagues_rels" USING btree ("users_id");
  CREATE INDEX "mini_leagues_competition_idx" ON "mini_leagues" USING btree ("competition_id");
  CREATE INDEX "mini_leagues_owner_idx" ON "mini_leagues" USING btree ("owner_id");
  CREATE UNIQUE INDEX "mini_leagues_invite_code_idx" ON "mini_leagues" USING btree ("invite_code");
  CREATE INDEX "mini_leagues_updated_at_idx" ON "mini_leagues" USING btree ("updated_at");
  CREATE INDEX "mini_leagues_created_at_idx" ON "mini_leagues" USING btree ("created_at");
  CREATE INDEX "mini_leagues_rels_order_idx" ON "mini_leagues_rels" USING btree ("order");
  CREATE INDEX "mini_leagues_rels_parent_idx" ON "mini_leagues_rels" USING btree ("parent_id");
  CREATE INDEX "mini_leagues_rels_path_idx" ON "mini_leagues_rels" USING btree ("path");
  CREATE INDEX "mini_leagues_rels_users_id_idx" ON "mini_leagues_rels" USING btree ("users_id");
  CREATE INDEX "team_logos_updated_at_idx" ON "team_logos" USING btree ("updated_at");
  CREATE INDEX "team_logos_created_at_idx" ON "team_logos" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_logos_filename_idx" ON "team_logos" USING btree ("filename");
  CREATE INDEX "team_logos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "team_logos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "rate_limits_ip_idx" ON "rate_limits" USING btree ("ip");
  CREATE INDEX "rate_limits_updated_at_idx" ON "rate_limits" USING btree ("updated_at");
  CREATE INDEX "rate_limits_created_at_idx" ON "rate_limits" USING btree ("created_at");
  CREATE INDEX "announcements_targeting_target_roles_order_idx" ON "announcements_targeting_target_roles" USING btree ("order");
  CREATE INDEX "announcements_targeting_target_roles_parent_idx" ON "announcements_targeting_target_roles" USING btree ("parent_id");
  CREATE INDEX "announcements_is_active_idx" ON "announcements" USING btree ("is_active");
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE UNIQUE INDEX "announcements_locales_locale_parent_id_unique" ON "announcements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "countries_locales_locale_parent_id_unique" ON "countries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "badges_slug_idx" ON "badges" USING btree ("slug");
  CREATE INDEX "badges_icon_media_idx" ON "badges" USING btree ("icon_media_id");
  CREATE INDEX "badges_updated_at_idx" ON "badges" USING btree ("updated_at");
  CREATE INDEX "badges_created_at_idx" ON "badges" USING btree ("created_at");
  CREATE UNIQUE INDEX "badges_locales_locale_parent_id_unique" ON "badges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "badge_media_updated_at_idx" ON "badge_media" USING btree ("updated_at");
  CREATE INDEX "badge_media_created_at_idx" ON "badge_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "badge_media_filename_idx" ON "badge_media" USING btree ("filename");
  CREATE INDEX "badge_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "badge_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "badge_media_sizes_badge_sizes_badge_filename_idx" ON "badge_media" USING btree ("sizes_badge_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_competitions_id_idx" ON "payload_locked_documents_rels" USING btree ("competitions_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_id");
  CREATE INDEX "payload_locked_documents_rels_membership_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("membership_tiers_id");
  CREATE INDEX "payload_locked_documents_rels_user_memberships_id_idx" ON "payload_locked_documents_rels" USING btree ("user_memberships_id");
  CREATE INDEX "payload_locked_documents_rels_leaderboard_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("leaderboard_entries_id");
  CREATE INDEX "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id");
  CREATE INDEX "payload_locked_documents_rels_matches_id_idx" ON "payload_locked_documents_rels" USING btree ("matches_id");
  CREATE INDEX "payload_locked_documents_rels_predictions_id_idx" ON "payload_locked_documents_rels" USING btree ("predictions_id");
  CREATE INDEX "payload_locked_documents_rels_leagues_id_idx" ON "payload_locked_documents_rels" USING btree ("leagues_id");
  CREATE INDEX "payload_locked_documents_rels_mini_leagues_id_idx" ON "payload_locked_documents_rels" USING btree ("mini_leagues_id");
  CREATE INDEX "payload_locked_documents_rels_team_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("team_logos_id");
  CREATE INDEX "payload_locked_documents_rels_rate_limits_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_limits_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_badges_id_idx" ON "payload_locked_documents_rels" USING btree ("badges_id");
  CREATE INDEX "payload_locked_documents_rels_badge_media_id_idx" ON "payload_locked_documents_rels" USING btree ("badge_media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "general_settings_seo_seo_image_idx" ON "general_settings" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "general_settings_locales_locale_parent_id_unique" ON "general_settings_locales" USING btree ("_locale","_parent_id");

    END IF;
   END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_seen_announcements" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_locales" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "competitions" CASCADE;
  DROP TABLE "competitions_locales" CASCADE;
  DROP TABLE "competitions_rels" CASCADE;
  DROP TABLE "feedback" CASCADE;
  DROP TABLE "membership_tiers_features" CASCADE;
  DROP TABLE "membership_tiers" CASCADE;
  DROP TABLE "user_memberships" CASCADE;
  DROP TABLE "leaderboard_entries" CASCADE;
  DROP TABLE "teams_league_tags" CASCADE;
  DROP TABLE "teams" CASCADE;
  DROP TABLE "teams_locales" CASCADE;
  DROP TABLE "matches" CASCADE;
  DROP TABLE "predictions" CASCADE;
  DROP TABLE "leagues" CASCADE;
  DROP TABLE "leagues_rels" CASCADE;
  DROP TABLE "mini_leagues" CASCADE;
  DROP TABLE "mini_leagues_rels" CASCADE;
  DROP TABLE "team_logos" CASCADE;
  DROP TABLE "rate_limits" CASCADE;
  DROP TABLE "announcements_targeting_target_roles" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "announcements_locales" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "countries_locales" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "regions_locales" CASCADE;
  DROP TABLE "badges" CASCADE;
  DROP TABLE "badges_locales" CASCADE;
  DROP TABLE "badge_media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "general_settings" CASCADE;
  DROP TABLE "general_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_preferred_language";
  DROP TYPE "public"."enum_users_subscription_plan";
  DROP TYPE "public"."enum_users_subscription_plan_type";
  DROP TYPE "public"."enum_users_stats_trend";
  DROP TYPE "public"."enum_users_jersey_pattern";
  DROP TYPE "public"."enum_users_jersey_style";
  DROP TYPE "public"."enum_competitions_status";
  DROP TYPE "public"."enum_feedback_type";
  DROP TYPE "public"."enum_feedback_status";
  DROP TYPE "public"."enum_user_memberships_status";
  DROP TYPE "public"."enum_teams_league_tags";
  DROP TYPE "public"."enum_teams_type";
  DROP TYPE "public"."enum_teams_country";
  DROP TYPE "public"."enum_matches_status";
  DROP TYPE "public"."enum_matches_result_stage_type";
  DROP TYPE "public"."enum_matches_result_ending_type";
  DROP TYPE "public"."enum_predictions_status";
  DROP TYPE "public"."enum_leagues_type";
  DROP TYPE "public"."enum_announcements_targeting_target_roles";
  DROP TYPE "public"."enum_announcements_icon";
  DROP TYPE "public"."enum_badges_icon_type";
  DROP TYPE "public"."enum_badges_rarity";`)
}
