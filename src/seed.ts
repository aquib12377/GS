import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from './payload.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function seed() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminPassword) {
    console.error('SEED_ADMIN_PASSWORD env var is required')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // Admin user
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@example.com' } },
    limit: 1,
  })

  let admin
  if (existing.docs.length > 0) {
    admin = existing.docs[0]
    console.log('  ↳ Admin user already exists, skipping.')
  } else {
    admin = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        roles: ['admin'],
      },
    })
    console.log('  ✓ Created admin user: admin@example.com')
  }

  // Categories
  const categoryData = [
    { name: 'Guides', slug: 'guides', description: 'Step-by-step game guides and walkthroughs.' },
    { name: 'Reviews', slug: 'reviews', description: 'In-depth game reviews and ratings.' },
    { name: 'Builds', slug: 'builds', description: 'Character builds, loadouts, and optimization tips.' },
  ]

  const categories: Record<string, number | string> = {}
  for (const cat of categoryData) {
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
    if (found.docs.length > 0) {
      categories[cat.slug] = found.docs[0].id
      console.log(`  ↳ Category "${cat.name}" already exists.`)
    } else {
      const created = await payload.create({ collection: 'categories', data: cat })
      categories[cat.slug] = created.id
      console.log(`  ✓ Created category: ${cat.name}`)
    }
  }

  // Games
  const gamesData = [
    { name: 'Elden Ring', slug: 'elden-ring', platform: 'Multi' as const, releaseYear: 2022 },
    { name: 'Valorant', slug: 'valorant', platform: 'PC' as const, releaseYear: 2020 },
  ]

  const games: Record<string, number | string> = {}
  for (const game of gamesData) {
    const found = await payload.find({ collection: 'games', where: { slug: { equals: game.slug } }, limit: 1 })
    if (found.docs.length > 0) {
      games[game.slug] = found.docs[0].id
      console.log(`  ↳ Game "${game.name}" already exists.`)
    } else {
      const created = await payload.create({ collection: 'games', data: game })
      games[game.slug] = created.id
      console.log(`  ✓ Created game: ${game.name}`)
    }
  }

  // Posts
  const postsData = [
    {
      title: 'Elden Ring: Complete Beginner Guide',
      slug: 'elden-ring-complete-beginner-guide',
      excerpt: 'Everything you need to know to survive your first hours in the Lands Between.',
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      game: games['elden-ring'],
      categories: [categories['guides']],
      tags: [{ tag: 'elden-ring' }, { tag: 'beginner' }, { tag: 'soulsborne' }],
      author: admin.id,
    },
    {
      title: 'Valorant: Best Agents for Ranked in 2024',
      slug: 'valorant-best-agents-ranked-2024',
      excerpt: 'Climb the ranked ladder with these top-tier agent picks for each role.',
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      game: games['valorant'],
      categories: [categories['guides'], categories['builds']],
      tags: [{ tag: 'valorant' }, { tag: 'ranked' }, { tag: 'agents' }],
      author: admin.id,
    },
  ]

  for (const postData of postsData) {
    const found = await payload.find({ collection: 'posts', where: { slug: { equals: postData.slug } }, limit: 1 })
    if (found.docs.length > 0) {
      console.log(`  ↳ Post "${postData.title}" already exists.`)
      continue
    }

    // Posts require coverImage — we'll skip it in seed since no real images exist
    // The post will be created without a cover; users can add one via admin
    try {
      await payload.create({
        collection: 'posts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: postData as any,
      })
      console.log(`  ✓ Created post: ${postData.title}`)
    } catch (err) {
      console.warn(`  ⚠ Could not create post "${postData.title}" (likely missing required coverImage):`, (err as Error).message)
    }
  }

  console.log('\n✅ Seed complete!')
  console.log(`\n  Admin credentials:`)
  console.log(`    Email:    admin@example.com`)
  console.log(`    Password: (from SEED_ADMIN_PASSWORD env var)`)
  console.log(`\n  Admin URL: http://localhost:3000/admin`)

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
