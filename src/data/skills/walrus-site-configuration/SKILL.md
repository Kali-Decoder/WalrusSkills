---
name: Walrus Site Configuration
description: Configure Walrus Sites using ws-resources.json — HTTP headers, client-side routes, redirects, onchain metadata, site_name, object_id, ignore patterns, and raw markdown serving. Use when deploying or updating Walrus Sites with site-builder, SPA routing, caching, or Sui Object Display metadata.
category: Infrastructure
difficulty: intermediate
author: WalSkills
version: "1.0.0"
skills:
  - Walrus
  - Walrus Sites
  - Site Builder
  - ws-resources.json
  - HTTP Headers
  - Sui
  - Frontend
  - Static Sites
---

# Walrus Site Configuration

**Sources:**
- https://docs.wal.app/docs/sites/configuration/site-configuration
- https://docs.wal.app/docs/sites/configuration/specifying-http-headers
- https://docs.wal.app/docs/sites/configuration/adding-metadata

In its base configuration, a Walrus Site serves static assets through a portal. Many modern web applications require custom headers, client-side routing, redirects, and human-readable onchain metadata.

The `site-builder` reads an optional **`ws-resources.json`** file in the site directory root. This file is **not uploaded to Walrus** and **not served to visitors**.

---

## When to Use This Skill

- Creating or updating `ws-resources.json` for a Walrus Site
- SPA routing (`/*` → `/index.html`)
- Server-side redirects (internal or external)
- Custom `Content-Type`, `Cache-Control`, `Content-Disposition`, `Content-Encoding`
- Onchain site metadata for explorers and wallets (Sui Object Display)
- Preserving `object_id` across deploys
- Excluding dev files with `ignore`
- Serving raw markdown for LLM ingestion

---

## Core Rules

1. Field names in `ws-resources.json` must be **`snake_case`**.
2. **`ws-resources.json` is never served** — it stays local and guides `site-builder` only.
3. **Preserve `ws-resources.json` after first deploy** — without `object_id`, `deploy` creates a new site.
4. Header paths are **exact** (no wildcards in `headers` keys).
5. For raw markdown, `content-type` **must be lowercase**.
6. `ignore` wildcards are only valid in the **last path segment** (`/foo/*` yes, `/foo/*/bar` no).
7. `--site-name` CLI flag **overrides** `site_name` in the file.
8. `--object-id` CLI flag can override missing `object_id` in the file.

---

## Custom Config Path

Default: site root as `ws-resources.json`.

Override with `--ws-resources` on `deploy`, `publish`, or `update`:

```bash
site-builder deploy ./dist --ws-resources ./config/ws-resources.json
```

---

# Full `ws-resources.json` Example

```json
{
  "headers": {
    "/index.html": {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "max-age=3500"
    }
  },
  "routes": {
    "/*": "/index.html",
    "/accounts/*": "/accounts.html",
    "/path/assets/*": "/assets/asset_router.html"
  },
  "redirects": {
    "/old-game": { "location": "/index.html", "status_code": 308 },
    "/walrus-docs": { "location": "https://docs.wal.app", "status_code": 301 },
    "/redirects/**/*": { "location": "/walrus.svg", "status_code": 302 }
  },
  "metadata": {
    "link": "https://subdomain.wal.app",
    "image_url": "https://www.walrus.xyz/walrus-site",
    "description": "This is a walrus site.",
    "project_url": "https://github.com/MystenLabs/walrus-sites/",
    "creator": "MystenLabs"
  },
  "site_name": "My Walrus Site",
  "object_id": "0xe674c144119a37a0ed9cef26a962c3fdfbdbfd86a3b3db562ee81d5542a4eccf",
  "ignore": ["/private/*", "/secret.txt", "/images/tmp/*"]
}
```

---

# Section 1 — HTTP Headers (`headers`)

Attach custom HTTP response headers per **exact resource path**. Headers override portal defaults.

```json
{
  "headers": {
    "/index.html": {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "max-age=3500"
    },
    "/assets/index.a1b2c3d4.js": {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "max-age=31536000, immutable"
    },
    "/assets/index.e5f6a7b8.css": {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "max-age=31536000, immutable"
    },
    "/downloads/report.pdf": {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"report.pdf\""
    }
  }
}
```

Resource paths always start from root `/`. No wildcards in header keys.

## Defaults

- `site-builder` infers `Content-Type` from file extension.
- `Content-Encoding` defaults to `identity`.
- Unknown types → `application/octet-stream`.
- Explicit headers in `ws-resources.json` **override** defaults.

## `Content-Type`

Set explicitly when inference is wrong, charset is needed, or type is unrecognized:

```json
"/feed.xml":      { "Content-Type": "application/rss+xml; charset=utf-8" }
"/app.wasm":      { "Content-Type": "application/wasm" }
"/fonts/x.woff2": { "Content-Type": "font/woff2" }
"/data.csv":      { "Content-Type": "text/csv; charset=utf-8" }
```

## `Cache-Control`

Walrus blobs are immutable — hashed assets can be cached forever; entry points should not.

```json
"/index.html":                { "Cache-Control": "no-cache" }
"/assets/app.a1b2c3d4.js":    { "Cache-Control": "max-age=31536000, immutable" }
"/assets/style.e5f6a7b8.css": { "Cache-Control": "max-age=31536000, immutable" }
"/data/prices.json":          { "Cache-Control": "max-age=300" }
```

| Value | Meaning |
|-------|---------|
| `no-cache` | Revalidate before each use |
| `no-store` | Never cache |
| `max-age=31536000, immutable` | Cache 1 year (content never changes) |
| `max-age=3600` | Cache 1 hour |

## `Content-Disposition`

```json
"/docs/guide.md":    { "Content-Disposition": "inline" }
"/whitepaper.pdf":   { "Content-Disposition": "inline" }
"/exports/data.csv": { "Content-Disposition": "attachment; filename=\"data-export.csv\"" }
```

## `Content-Encoding`

For pre-compressed build assets:

```json
"/assets/app.js.gz": {
  "Content-Type": "application/javascript; charset=utf-8",
  "Content-Encoding": "gzip"
},
"/assets/styles.css.br": {
  "Content-Type": "text/css; charset=utf-8",
  "Content-Encoding": "br"
}
```

---

# Section 2 — Routes (`routes`)

Client-side routing rules — map URL patterns to HTML entry points (SPAs, multi-page apps).

```json
{
  "routes": {
    "/*": "/index.html",
    "/accounts/*": "/accounts.html",
    "/admin/settings/*": "/admin.html"
  }
}
```

Refer to routes reference: https://docs.wal.app/docs/sites/linking/redirects

---

# Section 3 — Redirects (`redirects`)

Server-side redirects — internal paths or external URLs.

```json
{
  "redirects": {
    "/old-game": { "location": "/index.html", "status_code": 308 },
    "/walrus-docs": { "location": "https://docs.wal.app", "status_code": 301 },
    "/redirects/**/*": { "location": "/walrus.svg", "status_code": 302 }
  }
}
```

Common status codes: `301` (permanent), `302` (temporary), `308` (permanent, preserve method).

---

# Section 4 — Metadata (`metadata`)

Human-readable onchain info for portals, explorers, and wallets ([Sui Object Display](https://docs.sui.io/standards/display#display-properties)). **All fields optional.**

```json
{
  "metadata": {
    "link": "https://myproject.wal.app",
    "image_url": "https://myproject.wal.app/preview.png",
    "description": "A decentralized app built on Sui and Walrus.",
    "project_url": "https://github.com/myorg/myproject",
    "creator": "MyOrg"
  }
}
```

## Field reference

| Field | Type | Purpose |
|-------|------|---------|
| `link` | URL | Canonical public URL of the site |
| `image_url` | URL | Preview/thumbnail image (OG, explorers) |
| `description` | string | Short site summary (like HTML meta description) |
| `project_url` | URL | Source code, docs, or project homepage |
| `creator` | string | Author, org, or handle |

### `link` examples

```json
{ "link": "https://myapp.wal.app" }
{ "link": "https://www.myproject.xyz" }
{ "link": "https://2ffmxm7jmglccr79htmpdbaeqezp2krgftue5pfq9f83tdqjsc.localhost:3000" }
```

### `image_url` examples

```json
{ "image_url": "https://myapp.wal.app/og-image.png" }
{ "image_url": "https://cdn.myproject.xyz/preview/banner.jpg" }
{ "image_url": "https://aggregator.walrus-testnet.walrus.space/v1/blobs/abc123xyz" }
```

---

# Site Name (`site_name`)

Optional display name for the Walrus Site.

- `--site-name` CLI flag **overrides** `site_name` in the file.
- If omitted everywhere, a default name is used.

---

# Site Object ID (`object_id`)

Stores the Sui object ID of the deployed site.

- `site-builder deploy` uses this to **update** an existing site.
- Valid `object_id` present → deploy updates that site.
- Missing `object_id` and no `--object-id` flag → deploy **publishes a new site**.
- On successful first deploy, `site-builder` **auto-populates** `object_id` in the file.

### caution

Preserve `ws-resources.json` after first deployment. If missing on a later deploy, a **new site object** is created instead of updating the existing one.

---

# Ignore Patterns (`ignore`)

Exclude files/folders from upload. Each pattern starts with `/`; `*` wildcard only in last position.

```json
"ignore": [
  "/private/*",
  "/secret.txt",
  "/images/tmp/*"
]
```

Valid: `/foo/*` — Invalid: `/foo/*/bar`

---

# Serving Raw Markdown (LLM ingestion)

Raw `.md` files must exist in build output before deploy. Two `ws-resources.json` entries required:

**1. Header** (`content-type` must be lowercase):

```json
{
  "headers": {
    "/markdown/new/file/path/2.md": {
      "Content-Disposition": "inline",
      "content-type": "text/markdown; charset=utf-8"
    }
  }
}
```

**2. Route** (public URL → markdown file):

```json
{
  "routes": {
    "/docs/new/file/path/2.md": "/markdown/new/file/path/2.md"
  }
}
```

Generate markdown via Docusaurus/VitePress plugins or pre-build copy scripts into `/markdown`.

---

## Deploy Workflow

```txt
Build frontend → dist/
      ↓
Add/update ws-resources.json in dist/ (or site root)
      ↓
site-builder deploy ./dist
      ↓
object_id auto-written (first deploy)
      ↓
Portal serves with headers, routes, redirects applied
```

```bash
site-builder --context=testnet deploy --epochs 1 ./dist
```

---

## Health Validation Checklist

- [ ] `ws-resources.json` uses `snake_case` field names
- [ ] File placed in site root (or `--ws-resources` path set)
- [ ] `object_id` preserved for updates
- [ ] SPA routes configured (`/*` → `/index.html`)
- [ ] Hashed assets use `max-age=31536000, immutable`
- [ ] `index.html` uses `no-cache` or short `max-age`
- [ ] Raw markdown uses lowercase `content-type`
- [ ] `ignore` patterns exclude secrets and dev files
- [ ] Metadata `link` matches live portal URL

---

## Common Fixes

### Deploy creates new site instead of updating

Restore `object_id` in `ws-resources.json` or pass `--object-id`.

### Markdown downloads instead of rendering

Use lowercase `content-type` and `Content-Disposition: inline`.

### SPA routes return 404 on refresh

Add `"routes": { "/*": "/index.html" }`.

### Wrong MIME type

Add explicit `Content-Type` header for that exact path.

### Secret file published

Add path to `ignore` and redeploy.

---

## References

- Site configuration: https://docs.wal.app/docs/sites/configuration/site-configuration
- HTTP headers: https://docs.wal.app/docs/sites/configuration/specifying-http-headers
- Metadata: https://docs.wal.app/docs/sites/configuration/adding-metadata
- Routes & redirects: https://docs.wal.app/docs/sites/linking/redirects
- Site builder: https://docs.wal.app/docs/sites/getting-started/using-the-site-builder
