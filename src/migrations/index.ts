import * as migration_20260125_184842_add_scoring_updates_and_diffs from './20260125_184842_add_scoring_updates_and_diffs';

export const migrations = [
  {
    up: migration_20260125_184842_add_scoring_updates_and_diffs.up,
    down: migration_20260125_184842_add_scoring_updates_and_diffs.down,
    name: '20260125_184842_add_scoring_updates_and_diffs'
  },
];
