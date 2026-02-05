import * as migration_20260202_144540 from './20260202_144540';
import * as migration_20260204_211500_add_user_stats from './20260204_211500_add_user_stats';

export const migrations = [
  {
    up: migration_20260202_144540.up,
    down: migration_20260202_144540.down,
    name: '20260202_144540'
  },
  {
    up: migration_20260204_211500_add_user_stats.up,
    down: migration_20260204_211500_add_user_stats.down,
    name: '20260204_211500_add_user_stats'
  },
];
