# WalSkills — Walrus Skills Marketplace

<img width="1231" height="812" alt="WalSkills screenshot" src="https://github.com/user-attachments/assets/fa269b0e-3f7f-4fc3-9282-1dd464e0ca37" />

WalSkills is a developer marketplace for the Walrus + Sui ecosystem.

Our mission is to make onboarding and shipping on Walrus dramatically easier with reusable, agent-friendly building blocks.

## Who We Are

WalSkills is:

- A content-driven developer hub for Walrus builders
- A practical onboarding layer for teams and solo developers
- A reusable marketplace of skills, templates, and operational knowledge

## What We Offer

### Skills

Installable, agent-ready folders with `SKILL.md` instructions to execute specific tasks quickly.

Examples:

- Deploying a Walrus Site
- Deploying a local portal
- Configuring `ws-resources.json`
- Linking Walrus Sites to external URLs

### Templates

Starter implementation patterns that help teams move from idea to working project faster.

### Knowledge Bases

Structured guides for Walrus workflows, including:

- Walrus CLI setup
- Blob storage, reading, and lifecycle management
- Quilt usage patterns
- Site deployment and infrastructure configuration

Each KB entry is available both in UI and as raw markdown routes for agent consumption.

### Curated Collections

Pre-bundled skill paths for common journeys such as:

- first Walrus site setup
- infrastructure and configuration workflows
- shipping end-to-end apps on Walrus + Sui

## Why It Exists

Building on Walrus can involve many repeated setup and configuration steps.

WalSkills packages repeatable workflows so teams can:

- onboard new developers faster
- standardize implementation quality
- improve reliability of AI-assisted development flows

## Product Experience

- Browse and filter skills, templates, and KB articles
- Use curated collections to start with proven bundles
- Copy install commands and download content instantly
- Read detailed markdown-based docs and previews
- Access a mobile-responsive interface for on-the-go use

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- `react-markdown` + `remark-gfm`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Content Architecture

All marketplace content is filesystem-based under `src/data`:

- `src/data/skills/<slug>/` — skills (`SKILL.md`, optional `README.md`)
- `src/data/templates/<slug>/` — templates (`SKILL.md` or `Skill.md`)
- `src/data/knowledge-bases/<slug>/` — knowledge (`KB.md`)
- `src/data/collections.json` — curated collection definitions

API routes in `src/app/api/*` load and serve this content to the frontend.

## Project Structure

- `src/app` — pages, routes, API handlers
- `src/components` — UI and feature components
- `src/lib` — loaders, parsing, search, utilities
- `src/data` — marketplace source content
- `public` — static assets

## Contributing Content

### Add a Skill

1. Create `src/data/skills/<slug>/`
2. Add `SKILL.md` with frontmatter + body
3. Optionally add `README.md`

### Add a Template

1. Create `src/data/templates/<slug>/`
2. Add `SKILL.md` (or `Skill.md`) with frontmatter + body

### Add a Knowledge Base

1. Create `src/data/knowledge-bases/<slug>/`
2. Add `KB.md` with frontmatter + body

## Vision

WalSkills aims to be the default developer entry point for Walrus:

- from first setup
- to first deployment
- to production-grade delivery patterns

If it helps builders ship faster on Walrus + Sui, it belongs in WalSkills.
