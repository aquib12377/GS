# GS Gaming Blog

A gaming guide blog with an auto-generated admin panel, built with Next.js 16 + Payload CMS 3 and deployed on Vercel.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| CMS / Admin | Payload CMS 3 — admin at `/admin` |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless, free tier) |
| Media storage | [Vercel Blob](https://vercel.com/storage/blob) |
| Styling | Tailwind CSS 4, dark theme, lime accent |
| Language | TypeScript 5 (strict) |
| Runtime | Node.js 22 |

---

## Vercel Deployment (10 steps)

### 1. Create a Neon database

Go to [neon.tech](https://neon.tech) → New Project → copy the **connection string** (pooled, `?sslmode=require`).

### 2. Enable Vercel Blob

In your Vercel project dashboard: **Storage → Blob → Create store** (or connect an existing one).

### 3. Deploy to Vercel

```bash
# One-click: push this repo to GitHub, then import it in vercel.com/new
# Or via CLI:
npm i -g vercel
vercel
```

### 4. Add environment variables in Vercel

| Variable | Value |
|---|---|
| `PAYLOAD_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URI` | Neon connection string |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when you link Blob storage |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` |
| `SEED_ADMIN_PASSWORD` | A strong password for seeding |

### 5. Redeploy

After adding env vars, trigger a redeploy from the Vercel dashboard. Payload creates the database tables automatically on first boot.

### 6. Run the seed script (optional)

From your local machine with `vercel env pull .env.local`:

```bash
vercel env pull .env.local
pnpm seed
```

This creates the admin user (`admin@example.com`) + 3 categories + 2 games + 2 sample posts.

### 7. Log in to admin

Visit `https://your-project.vercel.app/admin` and sign in.

### 8. Create a post

**Posts → Create New** → fill title, cover image, content, set status to **Published** → Save.

### 9. View the blog

Visit `https://your-project.vercel.app` — published posts appear immediately.

### 10. Done ✓

---

## Local Development

Pull env vars from your Vercel project (requires `vercel link`):

```bash
vercel env pull .env.local
pnpm install
pnpm dev
```

Or create `.env.local` manually from `.env.example` with your Neon + Blob credentials.

---

## Collections

| Collection | Description |
|---|---|
| `Users` | Blog authors with `admin` or `editor` roles |
| `Posts` | Rich text posts with drafts, versioning, auto-slug |
| `Categories` | Guides, Reviews, Builds, etc. |
| `Games` | Games with platform tags |
| `Media` | Uploads stored in Vercel Blob with 4 auto-generated sizes |

## Routes

| Route | Description |
|---|---|
| `/` | Latest published posts (12/page) |
| `/posts/[slug]` | Single post with Lexical content + JSON-LD |
| `/games/[slug]` | All posts for a game |
| `/categories/[slug]` | All posts in a category |
| `/admin` | Payload CMS admin panel |
| `/api/[...slug]` | Payload REST API |

## Useful commands

```bash
pnpm dev                   # start dev server
pnpm build                 # production build
pnpm generate:types        # regenerate payload-types.ts after schema changes
pnpm generate:importmap    # regenerate admin importMap.js
pnpm seed                  # seed admin user + sample content
```
