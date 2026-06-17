---
name: Linking Walrus Sites to External URLs
description: Configure outbound links, cross-site navigation, and external assets in Walrus Sites. Use when linking to third-party pages, other Walrus Sites, CDNs, Sui Explorer, GitHub, or when relative vs absolute URL resolution matters in portal-served HTML.
category: Infrastructure
difficulty: beginner
author: WalSkills
version: "1.0.0"
skills:
  - Walrus
  - Walrus Sites
  - HTML
  - Portal
  - Sui
  - SuiNS
  - Frontend
  - Web Development
---

# Linking from Walrus Sites to External URLs

Walrus Sites serves content stored on Walrus through a **portal**. All **relative URLs** in your site resolve against the onchain site object. Anything outside that object — third-party pages, APIs, CDN assets, other Walrus Sites — requires an **absolute URL**.

---

## When to Use This Skill

- Adding links to external websites, GitHub, Sui Explorer, or APIs
- Linking from one Walrus Site to another
- Loading images, fonts, or scripts from a CDN
- Debugging 404s caused by incorrect relative paths to off-chain resources
- Choosing between SuiNS subdomain links vs Base36 object ID links

---

## Core Rules

1. **Relative paths** resolve **inside the Walrus Site object** only.
2. **Absolute `https://` URLs** work without special portal configuration — the portal does not rewrite them.
3. **Never use relative paths** for off-chain resources (e.g. `../external/resource` → 404).
4. **Avoid protocol-relative URLs** (`//cdn.example.com/...`) — behavior depends on the portal scheme.
5. External assets must use **absolute URLs**; CORS policies still apply.
6. When using `target="_blank"`, always include `rel="noopener noreferrer"`.
7. Links **within the same site** can use relative paths (e.g. `/about`, `/blog/post-1`).

---

## URL Resolution Reference

| Type | Example | Resolves to |
|------|---------|-------------|
| Relative (within site) | `/assets/logo.png` | Blob inside site object |
| Relative (within site) | `assets/logo.png` | Blob inside site object |
| Absolute external | `https://cdn.example.com/logo.png` | External host |
| Protocol-relative | `//cdn.example.com/logo.png` | **Avoid** — scheme-dependent |
| Invalid off-chain relative | `../external/resource` | 404 if not in site object |

---

# Linking to External Pages

Standard HTML `<a>` tags with absolute `https://` URLs work without any special configuration. The portal does not intercept or rewrite absolute URLs in rendered HTML.

```html
<a href="https://example.com">Visit Example</a>
```

When a user clicks this link, the browser navigates directly to `https://example.com`. The portal is not involved after the initial page render.

### Open in a new tab

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Open in new tab
</a>
```

Including `rel="noopener noreferrer"` is a standard security practice when using `target="_blank"`.

---

# Linking to Other Walrus Sites

Each Walrus Site resolves through a **subdomain** on a portal host. To link from one Walrus Site to another, use the full subdomain URL.

### By SuiNS name

```html
<a href="https://OTHER_SITE_NAME.wal.app">Other site</a>
```

### By Base36-encoded Sui object ID (stable)

```html
<a href="https://BASE36_OBJECT_ID.wal.app">Site by object ID</a>
```

Using Base36 object IDs produces **stable links** that do not break if the SuiNS name associated with the site changes.

---

# Loading External Resources

External assets such as images, fonts, and scripts must use **absolute URLs**.

```html
<img src="https://cdn.example.com/logo.png" alt="Logo" />
<script src="https://cdn.example.com/analytics.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
```

The portal serves pages with standard browser security policies, so **CORS** restrictions apply. The external host must allow cross-origin requests for assets to load.

### caution

Do **not** use relative paths to reference off-chain resources. A path like `../external/resource` resolves within the Walrus Site object and returns a **404** if the resource does not exist there.

---

# Common Patterns

## Linking to a GitHub repository

```html
<a href="https://github.com/YOUR_ORG/YOUR_REPO">Source code</a>
```

## Linking to Sui Explorer for an object

```html
<a href="https://suiexplorer.com/object/OBJECT_ID">View on Sui Explorer</a>
```

## Loading a font from a CDN

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
```

## Linking between pages within the same site

```html
<a href="/about">About</a>
<a href="/blog/post-1">Read post</a>
```

Relative links within the same site resolve against the site object and do **not** require absolute URLs.

---

## Decision Guide

```txt
Is the resource part of this Walrus Site object?
  ├─ YES → use relative path (/path or path)
  └─ NO  → use absolute https:// URL

Is the target another Walrus Site?
  ├─ YES → https://SITE_NAME.wal.app
  │        or https://BASE36_OBJECT_ID.wal.app (stable)
  └─ NO  → https://external-domain.com/...

Opening in new tab?
  └─ Add target="_blank" rel="noopener noreferrer"
```

---

## Health Validation Checklist

- [ ] Internal navigation uses relative paths (`/about`, `/assets/...`)
- [ ] External pages use absolute `https://` URLs
- [ ] No protocol-relative URLs (`//...`)
- [ ] No relative paths pointing to off-chain resources
- [ ] Cross-site Walrus links use full `*.wal.app` subdomain URLs
- [ ] Stable cross-site links use Base36 object ID when SuiNS may change
- [ ] `target="_blank"` links include `rel="noopener noreferrer"`
- [ ] CDN assets load (CORS allows cross-origin if needed)

---

## Common Fixes

### External asset returns 404

You likely used a relative path. Switch to an absolute `https://` URL.

### CDN font or script blocked

Check browser console for CORS errors. The external host must permit cross-origin requests, or self-host the asset in your Walrus Site.

### Link to another Walrus Site broken after rename

Use the Base36 object ID subdomain instead of the SuiNS name:

```html
<a href="https://BASE36_OBJECT_ID.wal.app">Stable link</a>
```

### Protocol-relative URL behaves unexpectedly

Replace `//cdn.example.com/...` with `https://cdn.example.com/...`.

---

## References

- Walrus Sites portal docs: https://docs.wal.app/docs/sites/portals/
- Walrus Sites deployment: https://docs.wal.app/docs/sites/
