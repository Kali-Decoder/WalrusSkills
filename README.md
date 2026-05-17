# Walrus Skills Marketplace

Walrus Skills Marketplace is a decentralized skill and template marketplace + developer hub for building on **Walrus** and the **Sui** ecosystem.

It lets developers discover, share, and integrate reusable:
- skills & workflows (agent-ready folders)
- templates (starter app patterns)
- knowledge base articles (agent-fetchable URLs)

The UI is sleek monochrome (black/white) with a subtle grid background, and uses a pixel-style font site-wide.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS + shadcn/ui components

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build (webpack mode)
- `npm run start` – start the production server
- `npm run lint` – run ESLint

## Content (skills/templates/knowledge)

Marketplace content is loaded from the filesystem under `src/data/`:

- `src/data/skills/<slug>/` – skill folders (include `SKILL.md` and usually `README.md`)
- `src/data/templates/<slug>/` – template skills
- `src/data/knowledge-bases/<slug>/` – knowledge base markdown
- `src/data/collections.json` – curated collections

The Next.js API routes under `src/app/api/*` serve this content to the UI.

## Project structure

- `src/app` – App Router pages/routes
- `src/components` – UI + feature components
- `src/data` – marketplace content
- `public/fonts` – local fonts used by the UI
