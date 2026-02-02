import * as migration_20260128_092533_add_subscription_fields from './20260128_092533_add_subscription_fields';
import * as migration_20260128_104439_add_location_fields from './20260128_104439_add_location_fields';
import * as migration_20260128_123530_add_localized_location_and_custom_country from './20260128_123530_add_localized_location_and_custom_country';
import * as migration_20260128_125307_add_dynamic_locations_collections from './20260128_125307_add_dynamic_locations_collections';
import * as migration_20260202_071502_init_database from './20260202_071502_init_database';

export const migrations = [
  {
    up: migration_20260128_092533_add_subscription_fields.up,
    down: migration_20260128_092533_add_subscription_fields.down,
    name: '20260128_092533_add_subscription_fields',
  },
  {
    up: migration_20260128_104439_add_location_fields.up,
    down: migration_20260128_104439_add_location_fields.down,
    name: '20260128_104439_add_location_fields',
  },
  {
    up: migration_20260128_123530_add_localized_location_and_custom_country.up,
    down: migration_20260128_123530_add_localized_location_and_custom_country.down,
    name: '20260128_123530_add_localized_location_and_custom_country',
  },
  {
    up: migration_20260128_125307_add_dynamic_locations_collections.up,
    down: migration_20260128_125307_add_dynamic_locations_collections.down,
    name: '20260128_125307_add_dynamic_locations_collections',
  },
  {
    up: migration_20260202_071502_init_database.up,
    down: migration_20260202_071502_init_database.down,
    name: '20260202_071502_init_database'
  },
];
