import { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    group: 'System',
  },
  access: {
    // User vidí len svoje
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { recipient: { equals: user?.id } }
    },
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true, // "Vyhodnotenie zápasu SVK vs CZE"
    },
    {
      name: 'message',
      type: 'textarea', // "+5 bodov! Posunul si sa v rebríčku."
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Úspech', value: 'success' }, // Zelená
        { label: 'Varovanie', value: 'warning' }, // "Zápas začína o 10 min!"
      ],
      defaultValue: 'info',
    },
    {
      name: 'readAt',
      type: 'date',
      admin: { description: 'Ak je prázdne, správa je neprečítaná.' },
    },
    {
      name: 'link', // Klikateľný odkaz (napr. na detail zápasu)
      type: 'text',
    },
  ],
}
