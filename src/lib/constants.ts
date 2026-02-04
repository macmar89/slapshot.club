export const REFRESH_INTERVALS = {
  ONE_MINUTE: 60 * 1000,
  TWO_MINUTES: 2 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
} as const

export const BADGE_SLUGS = {
  BETA_TESTER: 'beta-tester',
  REFERRAL_TIER_1: 'referral-1',
  REFERRAL_TIER_2: 'referral-2',
  REFERRAL_TIER_3: 'referral-3',
  REFERRAL_TIER_4: 'referral-4',
} as const

export const MAX_POSSIBLE_POINTS = 5
