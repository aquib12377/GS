import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Params = Promise<{ slug: string }>

async function getPost(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }

  const cover = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage : null
  const ogUrl = cover?.sizes?.og?.url ?? cover?.url ?? undefined

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: ogUrl ? [{ url: ogUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cover = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage : null
  const featureUrl = cover?.sizes?.feature?.url ?? cover?.url ?? null
  const featureW = cover?.sizes?.feature?.width ?? cover?.width ?? 1280
  const featureH = cover?.sizes?.feature?.height ?? cover?.height ?? 720
  const author = typeof post.author === 'object' && post.author ? post.author : null
  const game = typeof post.game === 'object' && post.game ? post.game : null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = Array.isArray(post.categories)
    ? post.categories.filter((c) => typeof c === 'object' && c !== null) as Array<{ id: string | number; name: string; slug: string }>
    : []
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  // Related posts (same game or category)
  const payload = await getPayload({ config })
  const gameId = typeof game === 'object' && game ? (game as { id: string | number }).id : null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedWhere: any = gameId
    ? { game: { equals: gameId }, status: { equals: 'published' } }
    : { status: { equals: 'published' } }

  const related = await payload.find({
    collection: 'posts',
    where: relatedWhere,
    limit: 3,
    depth: 2,
    sort: '-publishedAt',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: featureUrl,
    author: author ? { '@type': 'Person', name: author.email } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-neutral-400">
          {game && (
            <Link
              href={`/games/${game.slug}`}
              className="text-accent font-mono uppercase tracking-wider text-xs hover:underline"
            >
              {game.name}
            </Link>
          )}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="border border-neutral-700 px-2 py-0.5 rounded text-xs hover:border-accent hover:text-accent transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          {date && <time dateTime={post.publishedAt ?? ''}>{date}</time>}
          {author && <span>by {author.email}</span>}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        {featureUrl && (
          <div className="mb-10 rounded-lg overflow-hidden border border-neutral-800">
            <Image
              src={featureUrl}
              alt={cover?.alt ?? post.title}
              width={featureW ?? 1280}
              height={featureH ?? 720}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {post.excerpt && (
          <p className="text-xl text-neutral-300 leading-relaxed mb-10 border-l-2 border-accent pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Lexical rich text */}
        {post.content && (
          <div className="prose prose-invert prose-neutral max-w-none prose-headings:font-display prose-a:text-accent prose-code:font-mono">
            <RichText data={post.content} />
          </div>
        )}

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-neutral-800">
            {post.tags.map((tagObj, i) => (
              <span key={i} className="text-xs font-mono bg-neutral-800 px-2 py-1 rounded text-neutral-400">
                #{typeof tagObj === 'object' && tagObj ? tagObj.tag : tagObj}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related posts */}
      {related.docs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-800">
          <h2 className="font-display text-2xl font-semibold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.docs.map((relPost) => {
              const relCover = typeof relPost.coverImage === 'object' && relPost.coverImage
                ? relPost.coverImage
                : null
              const relImgUrl = relCover?.sizes?.card?.url ?? relCover?.url ?? null
              return (
                <article key={relPost.id} className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
                  {relImgUrl && (
                    <Link href={`/posts/${relPost.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={relImgUrl}
                          alt={relCover?.alt ?? relPost.title}
                          width={768}
                          height={432}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-4">
                    <Link href={`/posts/${relPost.slug}`} className="font-display font-semibold hover:text-accent transition-colors">
                      {relPost.title}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
