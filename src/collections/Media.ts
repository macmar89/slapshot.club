import type { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => createId(),
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
