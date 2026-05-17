import type { CollectionBeforeChangeHook } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const setSlugAndMeta: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' || (operation === 'update' && data.title && !data.slug)) {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title as string)
    }
  }

  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}
