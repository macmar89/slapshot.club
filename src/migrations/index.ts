import * as migration_20260128_092533_add_subscription_fields from './20260128_092533_add_subscription_fields';
import * as migration_20260128_104439_add_location_fields from './20260128_104439_add_location_fields';
import * as migration_20260128_123530_add_localized_location_and_custom_country from './20260128_123530_add_localized_location_and_custom_country';

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
    name: '20260128_123530_add_localized_location_and_custom_country'
  },
];
