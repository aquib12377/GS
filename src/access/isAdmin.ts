import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true
  return { author: { equals: user.id } }
}

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isPublishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
