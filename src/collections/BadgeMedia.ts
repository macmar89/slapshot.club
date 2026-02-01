import type { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const BadgeMedia: CollectionConfig = {
  slug: 'badge-media',
  admin: {
    group: 'Database',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'badge',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'badge',
        width: 128,
        height: 128,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
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
