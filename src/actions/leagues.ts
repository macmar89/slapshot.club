'use server'

import { getPayload } from 'payload'
import config from '../payload.config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

const LIMITS = {
  createdPrivate: 3,
  joinedPrivate: 5,
  maxMembersPrivate: 30,
}

type CreateLeagueResult = { success: true; league: any } | { success: false; error: string }

export async function createLeague(data: {
  name: string
  type?: 'private' | 'public'
  competitionId: string
}): Promise<CreateLeagueResult> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Force private
  const leagueType = 'private'

  try {
    // 1. Validation
    const owned = await payload.find({
      collection: 'leagues',
      where: {
        and: [{ owner: { equals: user.id } }, { type: { equals: leagueType } }],
      },
      limit: 0,
    })

    if (owned.totalDocs >= LIMITS.createdPrivate) {
      return { success: false, error: `You can only own ${LIMITS.createdPrivate} private leagues.` }
    }

    // 2. Create
    const league = await payload.create({
      collection: 'leagues',
      data: {
        name: data.name,
        type: leagueType,
        owner: user.id,
        competition: data.competitionId,
        members: [user.id],
        stats: {
          memberCount: 1,
        },
      },
    })

    revalidatePath(`/dashboard`)
    return { success: true, league }
  } catch (err: any) {
    console.error('Error creating league:', err)
    return { success: false, error: err.message || 'Failed to create league' }
  }
}

type JoinLeagueResult = { success: true; league: any } | { success: false; error: string }

export async function joinLeague(code: string): Promise<JoinLeagueResult> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // 1. Find League
    const leagues = await payload.find({
      collection: 'leagues',
      where: {
        code: { equals: code },
      },
      limit: 1,
    })

    if (leagues.totalDocs === 0) {
      return { success: false, error: 'League not found.' }
    }

    const league = leagues.docs[0] as any

    // 2. Check if already member
    const memberIds = league.members.map((m: any) => (typeof m === 'string' ? m : m.id))
    if (memberIds.includes(user.id)) {
      return { success: false, error: 'You are already a member of this league.' }
    }

    // 3. Check Capacity
    const maxMembers = league.maxMembers || LIMITS.maxMembersPrivate
    if (memberIds.length >= maxMembers) {
      return { success: false, error: 'League is full.' }
    }

    // 4. Check User Limits (if private)
    if (league.type === 'private') {
      const userJoined = await payload.find({
        collection: 'leagues',
        where: {
          and: [{ type: { equals: 'private' } }, { members: { contains: user.id } }],
        },
        limit: 0,
      })

      if (userJoined.totalDocs >= LIMITS.joinedPrivate) {
        return {
          success: false,
          error: `You can join max ${LIMITS.joinedPrivate} private leagues.`,
        }
      }
    }

    // 5. Update
    await payload.update({
      collection: 'leagues',
      id: league.id,
      data: {
        members: [...memberIds, user.id],
      },
    })

    revalidatePath(`/dashboard`)
    return { success: true, league }
  } catch (err: any) {
    console.error('Error joining league:', err)
    return { success: false, error: err.message || 'Failed to join league' }
  }
}

export async function deleteLeague(
  leagueId: string,
): Promise<{ success: boolean; error?: string }> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({
      collection: 'leagues',
      id: leagueId,
    })

    if (!league) return { success: false, error: 'League not found' }

    if (
      league.owner !== user.id &&
      typeof league.owner === 'object' &&
      league.owner.id !== user.id
    ) {
      return { success: false, error: 'Only the owner can delete the league' }
    }

    await payload.delete({
      collection: 'leagues',
      id: leagueId,
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete league' }
  }
}

export async function removeMember(
  leagueId: string,
  memberId: string,
): Promise<{ success: boolean; error?: string }> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({
      collection: 'leagues',
      id: leagueId,
    })

    if (!league) return { success: false, error: 'League not found' }

    // Check owner (handle string or object population)
    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id) {
      return { success: false, error: 'Only the owner can remove members' }
    }

    if (memberId === user.id) {
      return { success: false, error: 'You cannot remove yourself' }
    }

    const currentMembers = league.members?.map((m: any) => (typeof m === 'object' ? m.id : m)) || []
    const newMembers = currentMembers.filter((m: any) => m !== memberId)

    await payload.update({
      collection: 'leagues',
      id: leagueId,
      data: {
        members: newMembers,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove member' }
  }
}
