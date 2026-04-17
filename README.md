# Portfolio — Frontend Developer

Premium dark portfolio built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** — custom design tokens
- **Framer Motion** — scroll animations, layout transitions
- **react-type-animation** — typing effect in hero
- **react-hook-form + zod** — contact form validation
- **lucide-react** — icons

## Design

- Dark matte (`#0a0a0a`) + maroon accent (`#8B1A1A`)
- Cormorant Garamond (serif display) + Syne (sans) + DM Mono (monospace)
- Fully responsive: mobile → ultrawide

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd portfolio
npm install

# 2. Environment (optional)
cp .env.local.example .env.local
# Edit .env.local — add GITHUB_TOKEN for higher API rate limits

# 3. Customize content
# Edit src/data/portfolio.ts — change name, roles, skills, projects, socials

# 4. Run
npm run dev
# → http://localhost:3000
# → http://localhost:3000/dashboard
```

## Customization

### Your content lives in one file:

```
src/data/portfolio.ts
```

Change your name, roles, bio, skills, projects, social links — all in one place.

### Add your photo

Set `photoUrl` in `portfolioData.profile`:
```ts
photoUrl: "https://your-image-url.jpg",
// or put image in /public and use:
photoUrl: "/photo.jpg",
```

### Connect GitHub

Set `githubUsername` in `portfolioData.config`:
```ts
githubUsername: "yourusername",
```

Add `GITHUB_TOKEN` to `.env.local` for 5000 req/hr rate limit.

### Wire up contact form

In `src/app/api/contact/route.ts`, uncomment and configure your email provider (Resend is recommended).

### Deploy

```bash
npm run build
```

Push to GitHub → deploy on [Vercel](https://vercel.com) with zero config.

Add environment variables in Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home page (assembles sections)
│   ├── globals.css         # Design tokens, global styles
│   ├── api/
│   │   ├── contact/        # Contact form handler
│   │   └── github/         # GitHub API proxy
│   └── dashboard/          # Admin CMS
│       ├── layout.tsx      # Sidebar layout
│       ├── page.tsx        # Overview
│       ├── profile/        # Edit profile
│       ├── skills/         # CRUD skills
│       ├── projects/       # CRUD + GitHub sync
│       ├── social/         # Edit social links
│       ├── github/         # GitHub config
│       └── theme/          # Theme & SEO
├── components/
│   ├── ui/                 # Reusable: Navbar, Footer, FadeIn, SectionHeader
│   └── sections/           # Page sections: Hero, About, Skills, Projects, Contact
├── data/
│   └── portfolio.ts        # ← ALL your content lives here
├── lib/
│   ├── utils.ts            # cn(), formatDate(), truncate()
│   └── github.ts           # GitHub API fetch
└── types/
    └── index.ts            # TypeScript interfaces
```

## Upgrading to a Database

The mock data in `src/data/portfolio.ts` uses the same TypeScript interfaces as a database layer. To upgrade:

1. Add Prisma: `npm install prisma @prisma/client`
2. Define schema matching `src/types/index.ts`
3. Replace `portfolioData` imports with Prisma queries
4. Add API routes for dashboard mutations

The component props don't change — only the data source.
