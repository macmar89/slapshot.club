import * as migration_20260202_144540 from './20260202_144540';
import * as migration_20260204_211500_add_user_stats from './20260204_211500_add_user_stats';
import * as migration_20260206_133533_record_jobs_and_settings_changes from './20260206_133533_record_jobs_and_settings_changes';
import * as migration_20260206_204321_add_total_matches_to_competitions from './20260206_204321_add_total_matches_to_competitions';
import * as migration_20260206_221058_add_competition_stats from './20260206_221058_add_competition_stats';
import * as migration_20260208_141846_rename_api_ids from './20260208_141846_rename_api_ids';
import * as migration_20260208_151126_add_sync_fields_and_task from './20260208_151126_add_sync_fields_and_task';
import * as migration_20260208_155850_add_team_api_id from './20260208_155850_add_team_api_id';
import * as migration_20260208_174602_sync_tasks from './20260208_174602_sync_tasks';
import * as migration_20260209_205442_add_khl_sk1_tags from './20260209_205442_add_khl_sk1_tags';
import * as migration_20260210_071756_add_matches_date_index from './20260210_071756_add_matches_date_index';

export const migrations = [
  {
    up: migration_20260202_144540.up,
    down: migration_20260202_144540.down,
    name: '20260202_144540',
  },
  {
    up: migration_20260204_211500_add_user_stats.up,
    down: migration_20260204_211500_add_user_stats.down,
    name: '20260204_211500_add_user_stats',
  },
  {
    up: migration_20260206_133533_record_jobs_and_settings_changes.up,
    down: migration_20260206_133533_record_jobs_and_settings_changes.down,
    name: '20260206_133533_record_jobs_and_settings_changes',
  },
  {
    up: migration_20260206_204321_add_total_matches_to_competitions.up,
    down: migration_20260206_204321_add_total_matches_to_competitions.down,
    name: '20260206_204321_add_total_matches_to_competitions',
  },
  {
    up: migration_20260206_221058_add_competition_stats.up,
    down: migration_20260206_221058_add_competition_stats.down,
    name: '20260206_221058_add_competition_stats',
  },
  {
    up: migration_20260208_141846_rename_api_ids.up,
    down: migration_20260208_141846_rename_api_ids.down,
    name: '20260208_141846_rename_api_ids',
  },
  {
    up: migration_20260208_151126_add_sync_fields_and_task.up,
    down: migration_20260208_151126_add_sync_fields_and_task.down,
    name: '20260208_151126_add_sync_fields_and_task',
  },
  {
    up: migration_20260208_155850_add_team_api_id.up,
    down: migration_20260208_155850_add_team_api_id.down,
    name: '20260208_155850_add_team_api_id',
  },
  {
    up: migration_20260208_174602_sync_tasks.up,
    down: migration_20260208_174602_sync_tasks.down,
    name: '20260208_174602_sync_tasks',
  },
  {
    up: migration_20260209_205442_add_khl_sk1_tags.up,
    down: migration_20260209_205442_add_khl_sk1_tags.down,
    name: '20260209_205442_add_khl_sk1_tags',
  },
  {
    up: migration_20260210_071756_add_matches_date_index.up,
    down: migration_20260210_071756_add_matches_date_index.down,
    name: '20260210_071756_add_matches_date_index'
  },
];
