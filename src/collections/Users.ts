import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access'
import { createId } from '@paralleldrive/cuid2'
import { renderVerificationEmail, getVerificationSubject } from '../payload/emails/verification'
import {
  renderForgotPasswordEmail,
  getForgotPasswordSubject,
} from '../payload/emails/forgot-password'
import { BADGE_SLUGS } from '../lib/constants'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email', 'role'],
  },
  auth: {
    tokenExpiration: process.env.SESSION_EXPIRATION_SECONDS ? parseInt(process.env.SESSION_EXPIRATION_SECONDS) : 7200,
    verify: {
      generateEmailHTML: (args) => renderVerificationEmail(args),
      generateEmailSubject: ({ user }) => getVerificationSubject(user),
    },
    forgotPassword: {
      generateEmailHTML: (args) => renderForgotPasswordEmail(args as any),
      generateEmailSubject: (args: any) => getForgotPasswordSubject(args?.user),
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
      name: 'gdprConsent',
      type: 'checkbox',
      required: true,
      label: 'GDPR Súhlas',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Marketingový súhlas',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'marketingConsentDate',
      type: 'date',
      label: 'Dátum marketingového súhlasu',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.marketingConsent),
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
        {
          name: 'totalPredictions',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'lifetimePoints',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'lifetimePossiblePoints',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'currentOvr',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'maxOvrEver',
          type: 'number',
          defaultValue: 0,
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
    {
      name: 'referralData',
      type: 'group',
      label: 'Referral System',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'referralCode',
          type: 'text',
          unique: true,
          index: true,
          admin: {
            readOnly: true,
            description: 'Unikátny kód pre pozývanie nových používateľov.',
          },
        },
        {
          name: 'referredBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            readOnly: true,
            description: 'Používateľ, ktorý odporučil tohto člena.',
          },
        },
        {
          name: 'stats',
          type: 'group',
          label: 'Štatistiky',
          fields: [
            {
              name: 'totalRegistered',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true, description: 'Počet registrovaných cez tento kód.' },
            },
            {
              name: 'totalPaid',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true, description: 'Počet platiacich (Pro/VIP) z registrovaných.' },
            },
          ],
        },
      ],
    },
    {
      name: 'jersey',
      type: 'group',
      label: 'Dres',
      admin: {
        description: 'Vlastný dres používateľa',
      },
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#ef4444', 
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#ffffff',
        },
        {
          name: 'pattern',
          type: 'select',
          defaultValue: 'stripes',
          options: [
            { label: 'Pruhy', value: 'stripes' },
            { label: 'Pásy', value: 'bands' },
            { label: 'Čistý', value: 'plain' },
            { label: 'Šípky', value: 'chevrons' },
            { label: 'Obruče', value: 'hoops' },
          ],
        },
        {
          name: 'number',
          type: 'text',
          defaultValue: '10',
          validate: (val: string | null | undefined) => {
             if (val && val.length > 2) return 'Maximálne 2 cifry'
             return true
          }
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'classic',
          options: [
            { label: 'Klasický', value: 'classic' },
            { label: 'Moderný', value: 'modern' },
          ],
        }
      ]
    },
    {
      name: 'badges',
      type: 'relationship',
      relationTo: 'badges',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Získané odznaky používateľa.',
      },
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
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.referralData?.referralCode) {
          // Generate unique referral code
          const code = createId().slice(0, 8)
          
          data.referralData = {
            ...data.referralData,
            referralCode: code,
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        // --- 1. REFERRAL TRACKING (Original Logic) ---
        if (operation === 'create' && (doc as any).referralData?.referredBy) {
          try {
            const referrerId = typeof (doc as any).referralData.referredBy === 'object' 
              ? (doc as any).referralData.referredBy.id 
              : (doc as any).referralData.referredBy

            if (referrerId === doc.id) return

            const referrer = await req.payload.findByID({
              collection: 'users',
              id: referrerId,
            })

            if (referrer) {
              req.payload.update({
                collection: 'users',
                id: referrerId,
                data: {
                  referralData: {
                    ...(referrer as any).referralData,
                    stats: {
                      ...(referrer as any).referralData?.stats,
                      totalRegistered: ((referrer as any).referralData?.stats?.totalRegistered || 0) + 1,
                    },
                  },
                } as any,
                overrideAccess: true, 
              }).catch(err => {
                 req.payload.logger.error({ msg: 'Error updating referrer stats (async)', err })
              })
            }
          } catch (error) {
            req.payload.logger.error({ msg: 'Error setup referrer update', error })
          }
        }

        // --- 2. AUTOMATIC BADGES ASSIGNMENT ---
        const userBadges = (doc.badges || []) as any[]
        const newUserBadges = [...userBadges]
        let hasBadgeChanges = false

        // A. BETA TESTER (Only for new users in BETA mode)
        if (operation === 'create' && process.env.APP_STATUS === 'BETA') {
          const betaBadge = await req.payload.find({
            collection: 'badges',
            where: { slug: { equals: BADGE_SLUGS.BETA_TESTER } },
            limit: 1,
          })

          if (betaBadge.docs.length > 0) {
            const badgeId = betaBadge.docs[0].id
            if (!newUserBadges.some(b => (typeof b === 'object' ? b.id : b) === badgeId)) {
              newUserBadges.push(badgeId)
              hasBadgeChanges = true
            }
          }
        }

        // B. REFERRAL TIERS (For all users during any update)
        // Note: We check if totalRegistered changed or if it's a regular check
        const totalRegistered = (doc as any).referralData?.stats?.totalRegistered || 0
        
        if (totalRegistered >= 3) {
          // Find all referral badges to know what to replace
          const referralBadges = await req.payload.find({
            collection: 'badges',
            where: {
              slug: {
                in: [
                  BADGE_SLUGS.REFERRAL_TIER_1,
                  BADGE_SLUGS.REFERRAL_TIER_2,
                  BADGE_SLUGS.REFERRAL_TIER_3,
                  BADGE_SLUGS.REFERRAL_TIER_4,
                ]
              }
            }
          })

          const badgeMap = referralBadges.docs.reduce((acc, b) => {
            acc[b.slug] = b.id
            return acc
          }, {} as Record<string, string>)

          // Helper to check active referrals
          const getActiveCount = async () => {
             const referredUsers = await req.payload.find({
               collection: 'users',
               where: { 'referralData.referredBy': { equals: doc.id } },
               limit: 100, // Reasonable limit for now
             })

             let activeCount = 0
             for (const u of referredUsers.docs) {
               const predictions = await req.payload.count({
                 collection: 'predictions',
                 where: { user: { equals: u.id } },
               })
               if (predictions.totalDocs >= 25) {
                 activeCount++
               }
             }
             return activeCount
          }

          let targetBadgeSlug: string | null = null
          
          if (totalRegistered >= 20) {
            const activeCount = await getActiveCount()
            if (activeCount >= 5) targetBadgeSlug = BADGE_SLUGS.REFERRAL_TIER_4
          }
          
          if (!targetBadgeSlug && totalRegistered >= 10) {
            const activeCount = await getActiveCount()
            if (activeCount >= 2) targetBadgeSlug = BADGE_SLUGS.REFERRAL_TIER_3
          }

          if (!targetBadgeSlug && totalRegistered >= 5) {
            const activeCount = await getActiveCount()
            if (activeCount >= 1) targetBadgeSlug = BADGE_SLUGS.REFERRAL_TIER_2
          }

          if (!targetBadgeSlug && totalRegistered >= 3) {
            targetBadgeSlug = BADGE_SLUGS.REFERRAL_TIER_1
          }

          if (targetBadgeSlug) {
            const targetBadgeId = badgeMap[targetBadgeSlug]
            const referralBadgeIds = Object.values(badgeMap)

            // Remove existing referral badges
            const filteredBadges = newUserBadges.filter(b => {
              const id = typeof b === 'object' ? b.id : b
              return !referralBadgeIds.includes(id)
            })

            // Add target badge if not present
            if (filteredBadges.length !== newUserBadges.length || !newUserBadges.some(b => (typeof b === 'object' ? b.id : b) === targetBadgeId)) {
                filteredBadges.push(targetBadgeId!)
                newUserBadges.length = 0
                newUserBadges.push(...filteredBadges)
                hasBadgeChanges = true
            }
          }
        }

        if (hasBadgeChanges) {
          await req.payload.update({
            collection: 'users',
            id: doc.id,
            data: {
              badges: newUserBadges,
            } as any,
            overrideAccess: true,
          })
        }
      },
    ],
  },
}
