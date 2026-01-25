import type { CollectionConfig } from 'payload'

export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  admin: {
    hidden: true,
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'ip',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'count',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'lastRequest',
      type: 'date',
      required: true,
    },
  ],
}
