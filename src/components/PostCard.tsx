import Link from 'next/link'
import Image from 'next/image'

type MediaImage = {
  url?: string | null
  sizes?: {
    card?: { url?: string | null; width?: number | null; height?: number | null } | null
  } | null
  width?: number | null
  height?: number | null
  alt?: string
}

type Post = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  coverImage: MediaImage | string | null
  game?: { name: string; slug: string } | string | null
  categories?: Array<{ name: string; slug: string } | string> | null
}

export function PostCard({ post }: { post: Post }) {
  const cover = typeof post.coverImage === 'object' ? post.coverImage : null
  const cardUrl = cover?.sizes?.card?.url ?? cover?.url ?? null
  const cardW = cover?.sizes?.card?.width ?? cover?.width ?? 768
  const cardH = cover?.sizes?.card?.height ?? cover?.height ?? 432
  const alt = cover?.alt ?? post.title
  const game = typeof post.game === 'object' && post.game ? post.game : null
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : null

  return (
    <article className="group border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900 hover:border-neutral-600 transition-colors">
      <Link href={`/posts/${post.slug}`} className="block">
        {cardUrl ? (
          <div className="aspect-video overflow-hidden">
            <Image
              src={cardUrl}
              alt={alt}
              width={cardW ?? 768}
              height={cardH ?? 432}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-video bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-600 text-4xl">🎮</span>
          </div>
        )}
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
          {game && (
            <Link
              href={`/games/${game.slug}`}
              className="text-accent hover:underline font-mono uppercase tracking-wider"
            >
              {game.name}
            </Link>
          )}
          {date && <time dateTime={post.publishedAt ?? ''}>{date}</time>}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-display text-lg font-semibold leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </article>
  )
}
