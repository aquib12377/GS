import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'games', where: { slug: { equals: slug } }, limit: 1 })
  const game = result.docs[0]
  if (!game) return { title: 'Game Not Found' }
  return { title: `${game.name} — All Posts` }
}

export default async function GamePage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const gameResult = await payload.find({
    collection: 'games',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const game = gameResult.docs[0]
  if (!game) notFound()

  const postsResult = await payload.find({
    collection: 'posts',
    where: { game: { equals: game.id }, status: { equals: 'published' } },
    depth: 2,
    limit: 24,
    sort: '-publishedAt',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">{game.platform ?? 'Game'}</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          {game.name}
        </h1>
        <p className="text-neutral-400 mt-3">{postsResult.totalDocs} post{postsResult.totalDocs !== 1 ? 's' : ''}</p>
      </div>

      {postsResult.docs.length === 0 ? (
        <p className="text-neutral-600">No posts for this game yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsResult.docs.map((post) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      )}
    </div>
  )
}
