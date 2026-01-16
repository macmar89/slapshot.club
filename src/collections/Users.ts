import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access'; 
import { createId } from '@paralleldrive/cuid2';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username', 
    defaultColumns: ['username', 'email', 'role'],
  },
  auth: true,
  access: {
    read: () => true, 
    create: () => true,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req: { user } }) => (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      // CUID2 generujeme hneď pri inicializácii záznamu
      defaultValue: () => createId(),
      admin: {
        readOnly: true, // ID sa nikdy nesmie meniť manuálne
        position: 'sidebar',
      },
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Meno, ktoré uvidia ostatní v rebríčkoch.',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: "Redaktor", value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      saveToJWT: true, // Zrýchľuje prístup k role v Next.js (cez req.user)
      access: {
        update: isAdminFieldLevel, // Iba admin môže meniť roly
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'subscription',
      type: 'group',
      admin: {
        position: 'sidebar', 
      },
      fields: [
      {
        name: 'tier',
        type: 'select',
        defaultValue: 'free',
        options: [
          { label: 'Free (Rookie)', value: 'free' },
          { label: 'Supporter (Veteran)', value: 'supporter' },
          { label: 'Elite (Hall of Fame)', value: 'elite' },
        ],
        access: {
          update: isAdminFieldLevel, // Používateľ si nemôže sám prepnúť tier
        },
      },
      {
        name: 'status',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'Žiadne', value: 'none' },
          { label: 'Aktívne', value: 'active' },
          { label: 'Po splatnosti', value: 'past_due' },
          { label: 'Zrušené', value: 'canceled' },
        ],
        admin: {
          readOnly: true, // Iba systém (cez Webhook) to mení
        },
      },
      {
        name: 'endsAt',
        type: 'date',
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'isLifetime',
        type: 'checkbox',
        label: 'Doživotné členstvo (Admin Override)',
        defaultValue: false,
        access: {
          update: isAdminFieldLevel,
        },
      },
      {
        name: 'stripeSubscriptionId',
        type: 'text',
        admin: {
          readOnly: true,
          description: 'ID predplatného zo Stripe pre potreby API.',
        },
      },
    ],
  },
  ],
}
