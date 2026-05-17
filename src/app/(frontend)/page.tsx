import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { PostCard } from '@/components/PostCard'

export const metadata: Metadata = {
  title: 'GS Gaming Blog — Guides, Reviews & Builds',
  description: 'In-depth gaming guides, reviews, and build recommendations.',
}

const PAGE_SIZE = 12

type SearchParams = Promise<{ page?: string }>

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: PAGE_SIZE,
    page,
    depth: 2,
    sort: '-publishedAt',
  })

  const { docs: posts, totalPages, hasPrevPage, hasNextPage } = result

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Latest <span className="text-accent">Guides</span>
        </h1>
        <p className="text-neutral-400 text-lg">
          In-depth walkthroughs, builds, and reviews for the games you play.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-neutral-600 text-xl">No posts yet.</p>
          <p className="text-neutral-700 text-sm mt-2">
            <Link href="/admin" className="hover:text-accent underline">Log in to the admin panel</Link> to create your first post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3 mt-16">
          {hasPrevPage && (
            <Link
              href={`/?page=${page - 1}`}
              className="px-4 py-2 border border-neutral-700 rounded text-sm hover:border-accent hover:text-accent transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="text-neutral-500 text-sm">
            Page {page} of {totalPages}
          </span>
          {hasNextPage && (
            <Link
              href={`/?page=${page + 1}`}
              className="px-4 py-2 border border-neutral-700 rounded text-sm hover:border-accent hover:text-accent transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
