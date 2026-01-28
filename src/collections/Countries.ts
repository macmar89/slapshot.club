import { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
    group: 'Admin',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Názov krajiny',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Kód (ISO)',
      admin: {
        description: 'Napr. SK, CZ',
      },
    },
  ],
}
