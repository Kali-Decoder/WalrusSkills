# Walrus Site Configuration

Configure advanced Walrus Sites features through `ws-resources.json` — the local file that guides `site-builder` but is never uploaded or served.

## What This Skill Covers

Three documentation areas in one skill:

1. **Site configuration** — `ws-resources.json` structure, routes, redirects, `ignore`, `object_id`, raw markdown
2. **HTTP headers** — `Content-Type`, `Cache-Control`, `Content-Disposition`, `Content-Encoding`
3. **Metadata** — onchain display info for explorers and wallets (`link`, `image_url`, `description`, `project_url`, `creator`)

## Quick Start

Place `ws-resources.json` in your site build output:

```json
{
  "routes": { "/*": "/index.html" },
  "headers": {
    "/index.html": { "Cache-Control": "no-cache" },
    "/assets/app.abc123.js": {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "max-age=31536000, immutable"
    }
  },
  "metadata": {
    "link": "https://myapp.wal.app",
    "description": "My Walrus Site"
  }
}
```

Deploy:

```bash
site-builder deploy ./dist
```

## Critical Rule

**Never delete `ws-resources.json` after first deploy** — it contains `object_id` needed for updates.

## Installation

```
your-project/
└── .claude/skills/
    └── walrus-site-configuration/
        ├── SKILL.md
        └── README.md
```

## Docs

- https://docs.wal.app/docs/sites/configuration/site-configuration
- https://docs.wal.app/docs/sites/configuration/specifying-http-headers
- https://docs.wal.app/docs/sites/configuration/adding-metadata
