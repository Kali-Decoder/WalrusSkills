# Linking Walrus Sites to External URLs

Know when to use relative vs absolute URLs in Walrus Sites — and how to link to external pages, other sites, and CDN assets correctly.

## What This Skill Does

Teaches your agent how Walrus Sites resolve URLs through a portal:

- **Relative paths** → blobs inside your onchain site object
- **Absolute `https://` URLs** → external pages, APIs, CDNs, other Walrus Sites

## Quick Reference

| Link type | Use |
|-----------|-----|
| Same site page | `/about` or `/blog/post-1` |
| External website | `https://example.com` |
| Another Walrus Site | `https://SITE_NAME.wal.app` |
| Stable Walrus Site link | `https://BASE36_OBJECT_ID.wal.app` |
| CDN image/font/script | `https://cdn.example.com/...` |

## Key Rules

1. Never use relative paths for off-chain resources — they 404.
2. Avoid protocol-relative URLs (`//example.com`).
3. Use `rel="noopener noreferrer"` with `target="_blank"`.

## Example — External link

```html
<a href="https://github.com/YOUR_ORG/YOUR_REPO" target="_blank" rel="noopener noreferrer">
  Source code
</a>
```

## Example — Same site (relative OK)

```html
<a href="/about">About</a>
```

## Installation

```
your-project/
└── .claude/skills/
    └── linking-walrus-sites-external-urls/
        ├── SKILL.md
        └── README.md
```
