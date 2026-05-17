# GS Gaming Blog

A gaming guide blog with an auto-generated admin panel, built with Next.js 16 + Payload CMS 3, deployed on Vercel with Turso (hosted SQLite) + Vercel Blob.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| CMS / Admin | Payload CMS 3 — admin at `/admin` |
| Database | [Turso](https://turso.tech) — hosted SQLite, free tier, auto-creates tables |
| Media storage | [Vercel Blob](https://vercel.com/storage/blob) |
| Styling | Tailwind CSS 4, dark theme, lime accent |
| Language | TypeScript 5 (strict) |
| Runtime | Node.js 22 |

Database tables are created automatically on first startup — no manual migrations needed.

---

## Vercel Deployment (10 steps)

### 1. Create a Turso database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Log in and create a database
turso auth login
turso db create gaming-blog

# Get your connection URL and auth token
turso db show gaming-blog --url   # → libsql://gaming-blog-xxx.turso.io
turso db tokens create gaming-blog  # → eyJhbGci...
```

Or create via the [Turso dashboard](https://app.turso.tech) (no CLI required).

### 2. Enable Vercel Blob

In your Vercel project dashboard: **Storage → Blob → Create store**.  
The `BLOB_READ_WRITE_TOKEN` env var is added to your project automatically.

### 3. Push to GitHub and import in Vercel

[vercel.com/new](https://vercel.com/new) → Import your GitHub repo → Deploy.

### 4. Add environment variables in Vercel

| Variable | Value |
|---|---|
| `PAYLOAD_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URI` | `libsql://gaming-blog-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | token from step 1 |
| `BLOB_READ_WRITE_TOKEN` | auto-added from Blob store |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` |
| `SEED_ADMIN_PASSWORD` | strong password for first admin account |

### 5. Redeploy

After adding env vars, trigger a redeploy. Payload connects to Turso and **creates all tables automatically** — no manual migration step.

### 6. Seed the database (optional)

From your local machine:

```bash
# Pull env vars from Vercel
vercel env pull .env.local

pnpm install
pnpm seed
```

Creates: admin user (`admin@example.com`) + 3 categories + 2 games + 2 sample posts.

### 7. Log in to admin

Visit `https://your-project.vercel.app/admin` and sign in.

### 8. Create a post

**Posts → Create New** → fill title, cover image, content, set status to **Published** → Save.

### 9. View the blog

Visit `https://your-project.vercel.app` — published posts appear immediately (ISR revalidation on publish).

### 10. Done ✓

---

## Local Development

Local dev uses a SQLite file (`data/blog.db`) — no Turso account needed.

```bash
cp .env.example .env
# Edit .env: set PAYLOAD_SECRET and SEED_ADMIN_PASSWORD
# Leave DATABASE_URI as file:./data/blog.db

mkdir -p data
pnpm install
pnpm dev
```

Then open [http://localhost:3000/admin](http://localhost:3000/admin).  
Tables are created automatically on first run.

To also use Vercel Blob in local dev, add `BLOB_READ_WRITE_TOKEN` to `.env`  
(run `vercel env pull .env.local` if you have the Vercel CLI linked).

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
