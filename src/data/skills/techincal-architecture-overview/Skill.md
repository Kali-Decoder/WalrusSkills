---
name: Walrus Sites Technical Overview
description: Understand the architecture and lifecycle of Walrus Sites including quilts, Sui onchain indexing, portals, domain isolation, resource resolution, and decentralized static website hosting on Walrus + Sui.
category: Storage Infrastructure
difficulty: intermediate
author: Kali-Decoder
version: "1.0.0"
skills:
  - Walrus
  - Sui
  - Walrus Sites
  - Architecture
  - Portals
  - Quilts
  - Static Hosting
  - Decentralized Web
  - SuiNS
---

# Walrus Sites Technical Overview

## Scope

Use this skill for understanding Walrus Sites architecture and infrastructure:

- Walrus Sites internals
- Quilt-based storage architecture
- Sui site object indexing
- Portal request resolution
- Domain isolation
- SuiNS integrations
- Static decentralized hosting
- Resource routing
- Onchain ownership flows
- Site update lifecycle
- Walrus aggregators
- Browser request resolution

---

## What is a Walrus Site

A Walrus Site is a:

- fully decentralized static website
- stored across Sui and Walrus

with:

- no traditional origin server
- onchain ownership
- decentralized file storage
- portal-based HTTP delivery

---

## Core Architecture

```txt
Browser
    ↓
Portal
    ↓
Sui Site Object
    ↓
Walrus Aggregator
    ↓
Website Resource Bytes
```

---

## System Components

### Sui

Stores:

- site ownership
- resource indexes
- routes
- metadata
- headers
- dynamic fields

### Walrus

Stores:

- HTML
- CSS
- JavaScript
- images
- markdown
- static assets

as:

- blobs
- quilts
- quilt patches

### Portal

Acts as:

- HTTP gateway
- Sui resolver
- Walrus fetcher
- browser delivery layer

---

## Site Publishing Flow

When running:

```bash
site-builder deploy
```

the process happens in 2 phases.

---

## Phase 1 — Upload to Walrus

All website files are:

- bundled
- optimized
- uploaded

as:

- a Walrus quilt

---

## Quilt Architecture

```txt
Website Files
      ↓
Quilt Builder
      ↓
Walrus Quilt
      ↓
QuiltPatchIDs
```

### Quilt Benefits

- faster uploads
- lower storage costs
- optimized small-file storage
- efficient retrieval

### Quilt Tradeoff

Changing one file requires a full quilt re-upload.

---

## Phase 2 — Write Site Object to Sui

A Sui object is created that stores:

- routes
- quilt patch IDs
- metadata
- headers
- ownership information

---

## Site Object Architecture

```txt
Sui Site Object
    ├── routes
    ├── quilt patch references
    ├── custom headers
    ├── ownership
    └── metadata
```

---

## Ownership Rules

The wallet signing deploy, update, or destroy becomes the site owner.

Only the owner can:

- update the site
- destroy the site
- transfer ownership
- assign SuiNS names

---

## Resource Resolution Flow

When a browser opens a Walrus Site:

```txt
Browser
    ↓
Portal
    ↓
Sui Lookup
    ↓
Walrus Fetch
    ↓
HTTP Response
```

---

## Portal Request Resolution

### Step 1 — Identify Site

Portal extracts the subdomain and resolves the Sui object ID using SuiNS or a Base36 object ID.

### Step 2 — Lookup Resource

Portal reads dynamic fields, routes, and metadata from the Sui site object.

### Step 3 — Fetch Content

Portal requests a quilt patch from a Walrus aggregator. Only requested patches are reconstructed — the full quilt is not downloaded.

### Step 4 — Return Response

Portal sends resource bytes, HTTP headers, and metadata to the browser.

---

## Browser Resource Loading

This repeats for CSS, JS, fonts, images, markdown, and additional assets.

---

## Domain Isolation

Walrus Sites use isolated subdomains to enforce browser same-origin security.

### Why Isolation Matters

Without isolation:

- sites could access cookies
- wallet state leakage could occur
- cross-site access risks appear

### Isolation Architecture

```txt
site-a.wal.app
site-b.wal.app
site-c.wal.app
```

Each site has a unique origin and unique browser sandbox.

---

## Subdomain Generation

### Option 1 — SuiNS

Example:

```txt
https://flatland.wal.app
```

### Option 2 — Base36 Object ID

Object IDs are Base36 encoded because hex exceeds subdomain limits and Base36 is case insensitive.

### Important Restriction

```txt
wal.app does not support Base36 domains
```

Base36 access requires a self-hosted portal or local portal.

---

## Ownership Model

Walrus Sites are normal Sui objects. This enables transfers, ownership delegation, destruction, and SuiNS assignment.

---

## Site Updates

Updating a site:

```txt
Updated Files
      ↓
New Quilt Upload
      ↓
Sui Index Update
      ↓
Same Site Object ID
```

The site object ID does not change during updates. This preserves bookmarks, SuiNS names, portal URLs, and integrations.

---

## Example End-to-End Flow

```txt
Developer
    ↓
site-builder deploy
    ↓
Walrus Quilt Upload
    ↓
Sui Site Object Created
    ↓
Portal Resolution
    ↓
Browser Access
```

---

## Portal Responsibilities

Portals handle:

- DNS resolution
- Sui object lookup
- Walrus blob retrieval
- HTTP response serving
- content-type handling
- route resolution

---

## Walrus Aggregator Responsibilities

Aggregators handle:

- quilt reconstruction
- blob retrieval
- partial patch delivery
- decentralized storage access

---

## Validation Checklist

- site deployed successfully
- quilt uploaded
- Sui site object created
- portal resolves site
- routes resolve correctly
- resources load successfully
- ownership verified
- headers applied correctly
- markdown served properly
- SuiNS resolution working

---

## Common Fixes

### Site Not Loading

Verify:

- portal configuration
- DNS records
- Sui site object
- Walrus quilt availability

### Resource Missing

Verify:

- route mapping
- quilt patch existence
- ws-resources.json

### Base36 Domain Failure

Use a self-hosted portal because wal.app does not support Base36.

### Ownership Update Failure

Verify the wallet owns the site object.

### Incorrect Content Type

Verify response headers and lowercase `content-type`.

---

## Recommended Architecture

- Use quilts for all site uploads
- Keep routes deterministic
- Use SuiNS for production sites
- Deploy via build folders only
- Use portals for browser delivery
- Preserve ws-resources.json
- Use markdown exports for AI workflows

---

## Best Practices

- Use decentralized static hosting
- Preserve site object ownership
- Keep resource paths deterministic
- Use isolated domains
- Minimize unnecessary assets
- Rebuild before redeploying
- Use portals with TLS
- Use SuiNS for discoverability
- Optimize quilt sizes
- Keep frontend output clean

---

## Use Cases

- Decentralized websites
- AI-readable documentation
- Static frontend hosting
- Permanent knowledge bases
- Web3 applications
- Decentralized developer docs
- Agent-readable portals
- Community documentation hubs

---

## Vision

Walrus Sites transforms traditional static hosting into decentralized programmable web infrastructure powered by Sui ownership, Walrus storage, portal-based delivery, and decentralized resource resolution.
