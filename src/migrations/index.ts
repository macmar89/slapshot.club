import * as migration_20260128_092533_add_subscription_fields from './20260128_092533_add_subscription_fields';

export const migrations = [
  {
    up: migration_20260128_092533_add_subscription_fields.up,
    down: migration_20260128_092533_add_subscription_fields.down,
    name: '20260128_092533_add_subscription_fields'
  },
];
