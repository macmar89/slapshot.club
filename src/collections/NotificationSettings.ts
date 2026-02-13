import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../access'
import { createId } from '@paralleldrive/cuid2'

export const NotificationSettings: CollectionConfig = {
  slug: 'notification-settings',
  admin: {
    useAsTitle: 'id',
    group: 'Admin',
  },
  access: {
    read: isAdminOrSelf,
    create: () => true, // Anyone authenticated can create, but we'll handle uniqueness
    update: isAdminOrSelf,
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
      access: {
        update: () => false, // Cannot change owner
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'dailySummary',
      type: 'checkbox',
      label: 'Denný súhrn (10:00)',
      defaultValue: false,
    },
    {
      name: 'matchReminder',
      type: 'checkbox',
      label: 'Pripomienka zápasu (1h pred)',
      defaultValue: false,
    },
    {
      name: 'scoreChange',
      type: 'checkbox',
      label: 'Zmena skóre',
      defaultValue: false,
    },
    {
      name: 'matchEnd',
      type: 'checkbox',
      label: 'Koniec zápasu + vyhodnotenie',
      defaultValue: false,
    },
    {
      name: 'leaderboardUpdate',
      type: 'checkbox',
      label: 'Update rebríčku',
      defaultValue: false,
    },
  ],
}
