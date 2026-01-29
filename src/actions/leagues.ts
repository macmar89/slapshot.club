'use server'

import { getPayload } from 'payload'
import config from '../payload.config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { League, User } from '../payload-types'

// Helper to get Plan Limits
const getPlanLimits = (plan: string = 'free') => {
  switch (plan) {
    case 'vip':
      return { created: 5, joined: 10 }
    case 'pro':
      return { created: 2, joined: 5 }
    case 'free':
    default:
      return { created: 0, joined: 1 }
  }
}

// Helper to check if user is paying (Pro or VIP)
const isPayingMember = (user: User) => {
  return user.subscription?.plan === 'pro' || user.subscription?.plan === 'vip'
}

// Helper to calculate max members based on current members
const calculateMaxMembers = async (memberIds: string[], payload: any): Promise<number> => {
  if (!memberIds || memberIds.length === 0) return 0
  
  // Fetch full user objects to check subscription
  // We chunk it if necessary but usually leagues are small (max 30-50)
  const users = await payload.find({
    collection: 'users',
    where: {
      id: { in: memberIds },
    },
    limit: 100,
  })

  let slots = 0
  let hasPayingMember = false

  users.docs.forEach((u: User) => {
    if (u.subscription?.plan === 'vip') {
        slots += 10 // 1 for self + 9 free
        hasPayingMember = true
    } else if (u.subscription?.plan === 'pro') {
        slots += 5 // 1 for self + 4 free
        hasPayingMember = true
    }
  })

  // Ak v lige nie je žiadny platiaci člen (čo by sa nemalo stať pri validnej lige, lebo zakladateľ musí byť Pro/VIP),
  // tak je kapacita 1 (len zakladateľ? alebo 0?).
  // Ale pre istotu:
  if (!hasPayingMember && users.totalDocs > 0) {
      // Fallback ak by sa stala chyba a nikto neplatí (napr. exspirovalo)
      // Necháme toľko koľko je userov, ale nedovolíme pridať ďalších?
      // Pre jednoduchosť vrátime aspoň 1.
      return Math.max(users.totalDocs, 1) // alebo memberIds.length
  }
  
  // Vždy musí byť aspoň slot pre platiaceho, takže slots >= 5 ak je tam Pro.
  // Ak je tam len Free members (z nejakeho dovodu), slots bude 0.
  
  // Logic: Pro (1+4) = 5. VIP (1+9) = 10.
  
  return Math.max(slots, 1) 
}

type ActionResponse = { success: true; data?: any } | { success: false; error: string }

export async function createLeague(data: {
  name: string
  type?: 'private' | 'public'
  competitionId: string
}): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  // Only Admin can create Public
  if (data.type === 'public' && (user as any).role !== 'admin') {
    return { success: false, error: 'Only admins can create public leagues.' }
  }

  const leagueType = data.type || 'private'
  const limits = getPlanLimits(user.subscription?.plan)

  if (leagueType === 'private') {
    if (limits.created === 0) {
      return { success: false, error: 'Free users cannot create leagues.' }
    }

    const ownedCount = await payload.count({
      collection: 'leagues',
      where: {
        owner: { equals: user.id },
        type: { equals: 'private' },
      },
    })

    if (ownedCount.totalDocs >= limits.created) {
      return { 
        success: false, 
        error: `Dosiahli ste limit vytvorených líg pre Váš plán (${limits.created}).` 
      }
    }
  }

  try {
    const league = await payload.create({
      collection: 'leagues',
      data: {
        name: data.name,
        type: leagueType,
        owner: user.id,
        competition: data.competitionId,
        members: [user.id],
        maxMembers: 5, // Initial max for 1 paying owner
        stats: {
          memberCount: 1,
        },
      } as any,
    })

    revalidatePath(`/dashboard`)
    return { success: true, data: league }
  } catch (err: any) {
    console.error('Create league error:', err)
    return { success: false, error: err.message || 'Failed to create league' }
  }
}

export async function joinLeague(code: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const result = await payload.find({
      collection: 'leagues',
      where: { code: { equals: code } },
      limit: 1,
    })

    if (result.totalDocs === 0) return { success: false, error: 'Liga s týmto kódom neexistuje.' }

    const league = result.docs[0] as unknown as League
    
    const memberIds = (league.members as any[]).map(m => typeof m === 'string' ? m : m.id)
    const waitingIds = (league.waitingList as any[] || []).map(m => typeof m === 'string' ? m : m.id)

    if (memberIds.includes(user.id)) return { success: false, error: 'Už ste členom tejto ligy.' }
    if (waitingIds.includes(user.id)) return { success: false, error: 'Už čakáte na schválenie.' }

    // Add to Waiting List
    await payload.update({
      collection: 'leagues',
      id: league.id,
      data: {
        waitingList: [...waitingIds, user.id],
      } as any,
    })

    revalidatePath('/dashboard')
    // We don't return league to show immediately as joined, but success message
    return { success: true, data: { name: league.name } }

  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to join league' }
  }
}

export async function approveMember(leagueId: string, userId: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({ collection: 'leagues', id: leagueId })
    if (!league) return { success: false, error: 'League not found' }

    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id) return { success: false, error: 'Only owner can approve members.' }

    // 1. Check User's Join Limit
    const targetUser = await payload.findByID({ collection: 'users', id: userId })
    if (!targetUser) return { success: false, error: 'User not found' }

    const targetLimits = getPlanLimits(targetUser.subscription?.plan)

    // Count leagues target user is already in (private only?)
    // Prompt says: "joined max X leagues". Usually implies Private.
    // Query where members contains userId OR owner equals userId (owner implies member usually)
    const joinedCount = await payload.count({
      collection: 'leagues',
      where: {
         and: [
           { members: { contains: userId } },
           { type: { equals: 'private' } }
         ]
      },
    })

    if (joinedCount >= targetLimits.joined) {
      return { success: false, error: `Hráč dosiahol limit (${targetLimits.joined}) pre počet líg.` }
    }

    // 2. Check League Capacity (Dynamic)
    const currentMemberIds = (league.members as any[]).map(m => typeof m === 'string' ? m : m.id)
    const newMemberIds = [...currentMemberIds, userId]
    
    const newMaxMembers = await calculateMaxMembers(newMemberIds, payload)
    
    if (newMemberIds.length > newMaxMembers) {
      return { success: false, error: `Liga je plná! Potrebujete viac Pro/VIP členov na zvýšenie kapacity. (Max: ${newMaxMembers})` }
    }

    // 3. Move from waitingList to members
    const waitingIds = (league.waitingList as any[] || []).map(m => typeof m === 'string' ? m : m.id)
    const newWaitingList = waitingIds.filter(id => id !== userId)

    await payload.update({
      collection: 'leagues',
      id: leagueId,
      data: {
        members: newMemberIds,
        waitingList: newWaitingList,
        maxMembers: newMaxMembers,
      } as any,
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to approve member' }
  }
}

export async function rejectMember(leagueId: string, userId: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({ collection: 'leagues', id: leagueId })
    if (!league) return { success: false, error: 'League not found' }

    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id) return { success: false, error: 'Only owner can reject members.' }

    const waitingIds = (league.waitingList as any[] || []).map(m => typeof m === 'string' ? m : m.id)
    const newWaitingList = waitingIds.filter(id => id !== userId)

    await payload.update({
      collection: 'leagues',
      id: leagueId,
      data: {
        waitingList: newWaitingList,
      } as any,
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reject member' }
  }
}

export async function deleteLeague(leagueId: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({ collection: 'leagues', id: leagueId })
    if (!league) return { success: false, error: 'League not found' }

    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id) return { success: false, error: 'Only owner can delete league.' }

    await payload.delete({ collection: 'leagues', id: leagueId })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function removeMember(leagueId: string, memberId: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({ collection: 'leagues', id: leagueId })
    if (!league) return { success: false, error: 'League not found' }

    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id && memberId !== user.id) { // Owner or Self can remove
       // Actually user leaving is different? Usually yes.
       // But function name removeMember usually implies owner action.
       // Let's allow self-leave too.
    }
    
    // Authorization Check
    const isOwner = ownerId === user.id
    const isSelf = memberId === user.id
    
    if (!isOwner && !isSelf) {
      return { success: false, error: 'Unauthorized' }
    }
    
    if (isOwner && isSelf) {
      return { success: false, error: 'Owner cannot leave league. Transfer or delete it.' }
    }

    const currentMemberIds = (league.members as any[]).map(m => typeof m === 'string' ? m : m.id)
    const newMemberIds = currentMemberIds.filter(id => id !== memberId)

    // Recalculate max members because a paying member might have left
    const newMaxMembers = await calculateMaxMembers(newMemberIds, payload)
    
    // Note: If capacity drops below current count (e.g. paying member leaves and remaining free members > new capacity),
    // strictly speaking we should probably kick someone or warn?
    // But for now, we just update the maxMembers. It will preventing new joins until fixed.
    
    await payload.update({
      collection: 'leagues',
      id: leagueId,
      data: {
        members: newMemberIds,
        maxMembers: newMaxMembers,
      } as any,
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function transferOwnership(leagueId: string, newOwnerId: string): Promise<ActionResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const league = await payload.findByID({ collection: 'leagues', id: leagueId })
    if (!league) return { success: false, error: 'League not found' }

    const ownerId = typeof league.owner === 'object' ? league.owner.id : league.owner
    if (ownerId !== user.id) return { success: false, error: 'Only owner can transfer ownership.' }

    // Check if newOwner is a member
    const memberIds = (league.members as any[]).map(m => typeof m === 'string' ? m : m.id)
    if (!memberIds.includes(newOwnerId)) {
      return { success: false, error: 'New owner must be a member of the league.' }
    }
    
    // Check if new owner is paying?
    // User Limits: "Owner created max X leagues".
    // If I transfer league to someone, they are now the owner. Does it count against THEIR creation limit?
    // Logic: Yes. If they initiate creation. But receiving ownership?
    // Usually yes, unexpected ownership shouldn't break limits but to be safe:
    // We should check if new owner CAN own another league.
    
    const newOwner = await payload.findByID({ collection: 'users', id: newOwnerId })
    const limits = getPlanLimits(newOwner.subscription?.plan)
    
    // Count leagues they own
    const ownedCount = await payload.count({
      collection: 'leagues',
      where: {
        owner: { equals: newOwnerId },
        type: { equals: 'private' }
      }
    })
    
    if (ownedCount.totalDocs >= limits.created) {
       return { success: false, error: 'Nový vlastník nemá kapacitu na vlastnenie ďalšej ligy (Limit: ' + limits.created + ').' }
    }

    await payload.update({
      collection: 'leagues',
      id: leagueId,
      data: {
        owner: newOwnerId
      } as any
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch(err: any) {
    return { success: false, error: err.message }
  }
}
