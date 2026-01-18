import { CollectionConfig } from 'payload'

export const UserMemberships: CollectionConfig = {
  slug: 'user-memberships', // Premenované pre jasnosť
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'tier', 'status', 'validUntil'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      hasMany: false,
    },
    {
      name: 'tier', // <--- ZMENA: Prepájame na Tier, nie Competition
      type: 'relationship',
      relationTo: 'membership-tiers',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Aktívne', value: 'active' },
        { label: 'Neaplatené', value: 'pending' }, // Stripe webhook čaká
        { label: 'Zrušené', value: 'cancelled' },
        { label: 'Expirované', value: 'expired' },
      ],
      required: true,
    },
    {
      name: 'validUntil', // Dôležité pre ročné členstvá
      type: 'date',
      index: true,
    },
    // Stripe metadata pre debugging
    {
      name: 'billing',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'stripeSubscriptionId', type: 'text' },
        { name: 'lastPaymentDate', type: 'date' },
      ],
    },
  ],
}
