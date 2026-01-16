import { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '../access'
import { createId } from '@paralleldrive/cuid2';

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'status', 'read', 'createdAt', 'user'],
  },
  access: {
    read: isAdmin,
    create: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Chyba (Bug)', value: 'bug' },
        { label: 'Nápad (Idea)', value: 'idea' },
        { label: 'Iné (Other)', value: 'other' },
      ],
      defaultValue: 'idea',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Správa',
    },
    {
      name: 'pageUrl',
      type: 'text',
      label: 'URL stránky (kde sa to stalo)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Používateľ',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      label: 'Prečítané',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stav',
      defaultValue: 'new',
      options: [
        { label: 'Nový', value: 'new' },
        { label: 'V riešení', value: 'in-progress' },
        { label: 'Vyriešený', value: 'resolved' },
        { label: 'Ignorovaný', value: 'ignored' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
