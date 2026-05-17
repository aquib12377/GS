# GS Gaming Blog

A self-hosted gaming guide blog with an admin panel, built with Next.js 16 + Payload CMS 3 + SQLite.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Payload CMS 3** (embedded admin at `/admin`)
- **SQLite** via `@payloadcms/db-sqlite` — single file, no extra services
- **Tailwind CSS 4** — dark theme, lime accent
- **TypeScript 5** — strict mode

---

## Setup (10 steps)

### 1. Prerequisites

- Node.js 22 LTS
- pnpm 9+

### 2. Clone and install

```bash
git clone <repo-url>
cd <repo>
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
- Set `PAYLOAD_SECRET` to a random string: `openssl rand -base64 32`
- Set `SEED_ADMIN_PASSWORD` to a strong password
- Leave `DATABASE_URI` and `NEXT_PUBLIC_SERVER_URL` as-is for local dev

### 4. Create the data directory

```bash
mkdir -p data
```

### 5. Start the dev server

```bash
pnpm dev
```

The SQLite database (`data/blog.db`) is created automatically on first boot.

### 6. Seed the database (optional)

```bash
pnpm seed
```

Creates: 1 admin user, 3 categories, 2 games, and 2 sample posts.

### 7. Log in to admin

Open [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with `admin@example.com` and the password from `SEED_ADMIN_PASSWORD`.

### 8. Create a post

In the admin panel: **Posts → Create New**. Fill in title, cover image, content, set status to **Published**, save.

### 9. View the blog

Open [http://localhost:3000](http://localhost:3000). Published posts appear on the homepage.

### 10. Build for production

```bash
pnpm build
pnpm start
```

---

## Collections

| Collection | Description |
|---|---|
| `Users` | Blog authors with `admin` or `editor` roles |
| `Posts` | Blog posts with Lexical rich text, drafts, versioning |
| `Categories` | Post categories (Guides, Reviews, Builds, etc.) |
| `Games` | Games with platform tags |
| `Media` | Uploaded images with auto-generated sizes |

---

## Routes

| Route | Description |
|---|---|
| `/` | Latest published posts (12/page) |
| `/posts/[slug]` | Single post with Lexical content |
| `/games/[slug]` | All posts for a game |
| `/categories/[slug]` | All posts in a category |
| `/admin` | Payload CMS admin panel |

---

## Deployment

See `CLAUDE.md` for deployment options (Hetzner VPS recommended).

Back up `data/blog.db` and `media/` regularly.
