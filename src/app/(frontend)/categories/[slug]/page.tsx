import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  const cat = result.docs[0]
  if (!cat) return { title: 'Category Not Found' }
  return { title: `${cat.name} — All Posts` }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const catResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const category = catResult.docs[0]
  if (!category) notFound()

  const postsResult = await payload.find({
    collection: 'posts',
    where: { categories: { in: [category.id] }, status: { equals: 'published' } },
    depth: 2,
    limit: 24,
    sort: '-publishedAt',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Category</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-neutral-400 mt-3 max-w-xl">{category.description}</p>
        )}
        <p className="text-neutral-500 mt-2 text-sm">{postsResult.totalDocs} post{postsResult.totalDocs !== 1 ? 's' : ''}</p>
      </div>

      {postsResult.docs.length === 0 ? (
        <p className="text-neutral-600">No posts in this category yet.</p>
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
