import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'name',
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
      admin: {
        description: 'Interný názov (nezobrazuje sa používateľovi)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'OK',
      localized: true,
    },
    {
      name: 'maxDisplaysPerUser',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Koľkokrát sa má oznam zobraziť jednému používateľovi (0 = nekonečno)',
      },
    },
    {
      name: 'targeting',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'minPoints',
          type: 'number',
          admin: { description: 'Minimálny počet bodov používateľa' },
        },
        {
          name: 'maxPoints',
          type: 'number',
          admin: { description: 'Maximálny počet bodov používateľa' },
        },
        {
          name: 'targetRoles',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Redaktor', value: 'editor' },
            { label: 'User', value: 'user' },
          ],
        },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Bell', value: 'bell' },
        { label: 'Trophy', value: 'trophy' },
        { label: 'Star', value: 'star' },
        { label: 'Gift', value: 'gift' },
        { label: 'Alert', value: 'alert' },
      ],
      defaultValue: 'bell',
    },
  ],
}
