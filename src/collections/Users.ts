import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access'
import { createId } from '@paralleldrive/cuid2'
import { renderVerificationEmail, getVerificationSubject } from '../payload/emails/verification'
import {
  renderForgotPasswordEmail,
  getForgotPasswordSubject,
} from '../payload/emails/forgot-password'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email', 'role'],
  },
  auth: {
    verify: {
      generateEmailHTML: (args) => renderVerificationEmail(args),
      generateEmailSubject: ({ user }) => getVerificationSubject(user),
    },
    forgotPassword: {
      generateEmailHTML: (args) => renderForgotPasswordEmail(args as any),
      generateEmailSubject: ({ user }) => getForgotPasswordSubject(user),
    },
  },
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
        { label: 'Redaktor', value: 'editor' },
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
      name: 'preferredLanguage',
      type: 'select',
      options: [
        { label: 'Slovenčina', value: 'sk' },
        { label: 'English', value: 'en' },
        { label: 'Čeština', value: 'cz' },
      ],
      defaultValue: 'sk',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subscription',
      type: 'group',
      admin: {
        description: 'Informácie o predplatnom a úrovni prístupu',
      },
      fields: [
        {
          name: 'plan',
          type: 'select',
          defaultValue: 'free',
          required: true,
          saveToJWT: true, // Dôležité: Plán bude dostupný v session bez DB lookupu
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
            { label: 'VIP', value: 'vip' },
          ],
        },
        {
          name: 'planType',
          type: 'select',
          defaultValue: 'seasonal',
          required: true,
          options: [
            { label: 'Sezónne', value: 'seasonal' },
            { label: 'Lifetime', value: 'lifetime' },
          ],
        },
        {
          name: 'activeFrom',
          type: 'date',
          admin: {
            description: 'Dátum prvej aktivácie predplatného',
          },
        },
        {
          name: 'activeUntil',
          type: 'date',
          index: true, // Nutné pre rýchly Cron na konci sezóny
          admin: {
            condition: (_, siblingData) => siblingData?.planType !== 'lifetime',
            description: 'Dátum expirácie (pri Lifetime sa ignoruje)',
          },
        },
      ],
    },
    {
      name: 'hasSeenOnboarding',
      type: 'checkbox',
      defaultValue: false,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seenAnnouncements',
      type: 'array',
      fields: [
        {
          name: 'announcementId',
          type: 'text',
        },
        {
          name: 'displayCount',
          type: 'number',
          defaultValue: 1,
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Hráčske štatistiky',
      admin: {
        position: 'sidebar',
        description: 'Automaticky počítané systémom. Nemeňte manuálne.',
      },
      fields: [
        {
          name: 'totalPoints',
          type: 'number',
          defaultValue: 0,
          index: true, // Kľúčové pre globálny rebríček
          admin: { readOnly: true },
        },
        {
          name: 'globalRank',
          type: 'number',
          min: 1,
          index: true,
          admin: { readOnly: true, description: 'Aktuálne poradie v globálnom rebríčku.' },
        },
        {
          name: 'previousRank',
          type: 'number',
          min: 1,
          admin: { readOnly: true, description: 'Poradie pri poslednom Snapshote (včera).' },
        },
        {
          name: 'trend',
          type: 'select',
          // Virtuálne pole, ktoré si vypočítame/uložíme pri update
          options: [
            { label: 'Stúpa 🚀', value: 'up' },
            { label: 'Klesá 🔻', value: 'down' },
            { label: 'Stabilný ➖', value: 'stable' },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Lokácia',
      localized: true,
      admin: {
        description: 'Nepovinné údaje o lokácii používateľa',
      },
      fields: [
        {
          name: 'country',
          type: 'relationship',
          relationTo: 'countries',
          label: 'Krajina',
        },
        {
          name: 'customCountry',
          type: 'text',
          label: 'Názov krajiny',
          admin: {
            description: 'Zadajte názov vašej krajiny (ak nie je v zozname)',
            // Explicit check if selected country is "Other"
            // We'll need to know the ID of "Other" or check its property
            // For now, let's keep it visible if country is selected,
            // but in UI we'll show it only when a special "Other" country is picked.
            // A safer condition might be checking it manually in UI.
          },
        },
        {
          name: 'region',
          type: 'relationship',
          relationTo: 'regions',
          label: 'Kraj',
          admin: {
            description: 'Napr. Bratislavský, Jihomoravský, ...',
            condition: (data) => data?.location?.country,
          },
          filterOptions: ({ data }) => {
            if (data?.location?.country) {
              return {
                country: {
                  equals: data.location.country,
                },
              }
            }
            return false
          },
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/resend-verification',
      method: 'post',
      handler: async (req) => {
        const { email } = req.body as any
        if (!email) return Response.json({ error: 'Email is required' }, { status: 400 })

        try {
          const { docs } = await req.payload.find({
            collection: 'users',
            where: {
              email: { equals: email },
            },
          })

          if (docs.length > 0 && !docs[0]._verified) {
            // We can use the native email sending logic by triggering forgotPassword
            // OR we can use the internal sendVerificationEmail if we can access it.
            // In Payload 3.0, verified accounts have a verify-email endpoint that can be triggered.

            // Actually, the simplest is to update the user which might trigger it? No.
            // Let's use the local API to send it.
            // Since we're in the endpoint, we have access to req.payload.

            // @ts-ignore - internal method
            await req.payload.sendVerificationEmail({
              collection: 'users',
              user: docs[0],
            })

            return Response.json({ success: true })
          }
          return Response.json({ error: 'User not found or already verified' }, { status: 404 })
        } catch (err: any) {
          return Response.json({ error: err.message }, { status: 500 })
        }
      },
    },
  ],
}
