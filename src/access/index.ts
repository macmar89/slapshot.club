import { Access, FieldAccess } from 'payload'
import { User } from '../payload-types'

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdmin: Access = ({ req: { user } }) => {
  if (user && (user as any).role === 'admin') return true
  return false
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  if (user && (user as any).role === 'admin') return true
  return false
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if ((user as any).role === 'admin') return true

    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}