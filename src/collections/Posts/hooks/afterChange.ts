import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidatePost: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (doc.status === 'published' || previousDoc?.status === 'published') {
    revalidatePath('/')
    revalidatePath(`/posts/${doc.slug}`)
    if (doc.game) {
      revalidatePath(`/games/${typeof doc.game === 'object' ? doc.game.slug : doc.game}`)
    }
  }
  return doc
}
