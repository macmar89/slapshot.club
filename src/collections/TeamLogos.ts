import type { CollectionConfig } from 'payload'
import { createId } from '@paralleldrive/cuid2'

export const TeamLogos: CollectionConfig = {
  slug: 'team-logos',
  admin: {
    group: 'Database',
  },
  access: {
    read: () => true,
  },
  upload: {
    // Toto je lokálna cesta, v R2 sa riadime 'prefix' v configu
    staticDir: 'team_logo',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
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
