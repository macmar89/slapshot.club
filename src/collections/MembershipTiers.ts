import { CollectionConfig } from 'payload'

export const MembershipTiers: CollectionConfig = {
  slug: 'membership-tiers',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'price', 'rank'],
  },
  access: {
    read: () => true, // Verejné pre cenník na webe
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true, // Napr. "Ročné - Základ", "Ročné - Premium"
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Vyššie číslo = vyššia úroveň oprávnení. Slúži na porovnávanie.',
      },
    },
    {
      name: 'price', // Zatiaľ len informatívne, neskôr pre Stripe
      type: 'number',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
}
