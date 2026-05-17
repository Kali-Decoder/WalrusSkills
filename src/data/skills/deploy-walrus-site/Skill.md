---
name: walrus-sites-builder
description: Build, deploy, update, and manage decentralized websites on Walrus Sites using the site-builder CLI. Use when working on Walrus Sites deployments, static hosting, quilts, ws-resources.json routing, markdown exports, portals, or decentralized frontend hosting on Walrus + Sui.
category: Storage Infrastructure
topic: walrus-sites
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Sui
  - Walrus Sites
  - Site Builder
  - Static Hosting
  - Decentralized Storage
  - Web3
  - Frontend
  - Quilts
---

# Walrus Sites Builder

## Scope

Use this skill for building and deploying decentralized websites on Walrus:
- Walrus Sites deployment
- site-builder CLI setup
- Static frontend hosting
- Quilt-based uploads
- ws-resources.json configuration
- Portal integrations
- Markdown export hosting
- Decentralized web apps
- SuiNS site integrations
- Walrus portal routing
- Website update workflows
- React/Vite/Next.js deployment
- Custom route handling
- Content-Type configuration

---

# Core Rules

1. Always deploy built frontend output folders only.
2. Never upload:
   - `node_modules`
   - source directories
   - development files
3. Use quilts for optimized uploads.
4. Ensure every site contains:
   - `index.html`
5. Preserve `ws-resources.json` for updates.
6. Use:
   - `deploy`
instead of legacy:
   - `publish`
   - `update`
7. Testnet sites require self-hosted portals.
8. Mainnet sites require SuiNS for public browsing on `wal.app`.
9. Configure markdown headers explicitly for KB/agent exports.
10. Always rebuild frontend apps before redeploying.

---

# Install Site Builder

## Using suiup

Install suiup:

```bash
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
```

---

# Verify PATH

```bash
echo $PATH | tr ":" "\n"
```

---

# Install site-builder

```bash
suiup install site-builder@mainnet
```

---

# Verify Installation

```bash
site-builder --help
```

---

# Alternative Binary Installation

## Download Binary

```bash
curl https://storage.googleapis.com/mysten-walrus-binaries/site-builder-mainnet-latest-$SYSTEM -o site-builder

chmod +x site-builder
```

---

# Supported Systems

- ubuntu-x86_64
- ubuntu-x86_64-generic
- macos-arm64
- macos-x86_64

---

# Move Binary Into PATH

```bash
mv site-builder ~/.local/bin/
```

---

# Windows Installation

```powershell
(New-Object System.Net.WebClient).DownloadFile(
"https://storage.googleapis.com/mysten-walrus-binaries/site-builder-mainnet-latest-windows-x86_64.exe",
"site-builder.exe"
)
```

---

# Configuration

## Download Config

```bash
curl https://raw.githubusercontent.com/MystenLabs/walrus-sites/refs/heads/$NETWORK/sites-config.yaml \
  -o ~/.config/walrus/sites-config.yaml
```

---

# Supported Config Locations

- current working directory
- `$XDG_CONFIG_HOME/walrus/`
- `~/.config/walrus/`
- `~/.walrus/`

---

# Example Configuration

## `sites-config.yaml`

```yaml
contexts:
  testnet:
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799

    staking_object: 0xbe46180321c30aab2f8b3501e24048377287fa708018a5b7c2792b35fe339ee3

    general:
      wallet_env: testnet

      walrus_context: testnet

      walrus_package: 0xd84704c17fc870b8764832c535aa6b11f21a95cd6f5bb38a9b07d2cf42220c66

  mainnet:
    package: 0x26eb7ee8688da02c5f671679524e379f0b837a12f1d1d799f255b7eea260ad27

    staking_object: 0x10b9d30c28448939ce6c4d6c6e0ffce4a7f8a4ada8248bdad09ef8b70e4a3904

    general:
      wallet_env: mainnet

      walrus_context: mainnet

      walrus_package: 0xfdc88f7d7cf30afab2f82e8380d11ee8f70efb90e863d1de8616fae1bb09ea77

default_context: mainnet
```

---

# Site Deployment Workflow

```txt
Frontend Build
      ↓
site-builder deploy
      ↓
Quilt Upload
      ↓
Walrus Blob Storage
      ↓
Sui Site Object
      ↓
Portal Access
```

---

# Example Site Structure

```txt
walrus-site/
├── index.html
├── styles.css
├── app.js
├── assets/
└── ws-resources.json
```

---

# Deploy Example Site

## Clone Example

```bash
git clone https://github.com/MystenLabs/example-walrus-sites.git

cd example-walrus-sites
```

---

# Deploy Site

```bash
site-builder \
  --context=testnet \
  deploy \
  ./walrus-snake \
  --epochs 1
```

---

# Update Existing Site

```bash
site-builder \
  --context=testnet \
  deploy \
  --epochs 1 \
  ./walrus-snake
```

---

# Deploy Using Explicit Object ID

```bash
site-builder \
  --context=testnet \
  deploy \
  --object-id 0xSITE_ID \
  --epochs 1 \
  ./walrus-snake
```

---

# Quilt Uploads

Walrus Sites uses:
- quilts
- quilt patch IDs

Benefits:
- faster uploads
- lower storage costs
- optimized small-file storage

Tradeoff:
- changing one file re-uploads the entire quilt

---

# Build Folder Deployment Rules

Always deploy:
- build output folders

Never deploy:
- project roots

---

# Example: Vite Deployment

## Build Project

```bash
npm run build
```

---

# Deploy Dist Folder

```bash
site-builder \
  --context=testnet \
  deploy \
  --epochs 1 \
  my-website/dist
```

---

# Framework Build Folders

| Framework | Output Folder |
|---|---|
| Vite | `dist/` |
| Create React App | `build/` |
| Next.js | `out/` |
| Vue CLI | `dist/` |
| Docusaurus | `build/` |

---

# Convert Site ID

```bash
site-builder convert <OBJECT_ID>
```

---

# Sitemap Command

```bash
site-builder sitemap --id <OBJECT_ID>
```

---

# List Directory

```bash
site-builder list-directory <BUILD_DIRECTORY>
```

---

# Update Single Resource

```bash
site-builder update-resource \
  --id <OBJECT_ID> \
  <RESOURCE_PATH>
```

---

# Destroy Site

```bash
site-builder destroy --id <OBJECT_ID>
```

---

# Markdown Export Configuration

## Headers Example

```json
{
  "headers": {
    "/markdown/examples/checkpoint-data.md": {
      "Content-Disposition": "inline",
      "content-type": "text/markdown; charset=utf-8"
    }
  }
}
```

---

# Important Rule

```txt
content-type must be lowercase
```

---

# Markdown Route Example

```json
{
  "routes": {
    "/docs/examples/checkpoint-data.md":
      "/markdown/examples/checkpoint-data.md"
  }
}
```

---

# Combined Markdown Example

```json
{
  "headers": {
    "/markdown/examples/checkpoint-data.md": {
      "Content-Disposition": "inline",
      "content-type": "text/markdown; charset=utf-8"
    }
  },

  "routes": {
    "/docs/examples/checkpoint-data.md":
      "/markdown/examples/checkpoint-data.md"
  }
}
```

---

# Portal Access Rules

## Testnet

Requires:
- self-hosted portal
- local portal
- third-party portal

---

# Mainnet

Accessible through:
- `https://wal.app`

Requires:
- SuiNS configuration

---

# Health Validation Checklist

- site-builder installed
- sites-config.yaml configured
- frontend built successfully
- `index.html` exists
- deploy command succeeds
- ws-resources.json generated
- quilt upload completes
- site object created
- portal access functional
- markdown routes working
- content-type headers correct

---

# Common Fixes

## Config File Missing

Use:

```bash
--config /path/to/sites-config.yaml
```

---

# Uploading Wrong Files

Never deploy:
- `node_modules`
- project source
- development files

Deploy:
- build output only

---

# Site Not Visible on Mainnet

Verify:
- SuiNS configured
- site deployed to mainnet

---

# Markdown Downloads Instead of Rendering

Verify:
- lowercase `content-type`
- inline disposition header

---

# Update Failure

Verify:
- wallet owns site object
- ws-resources.json preserved

---

# Portal Access Failure

Verify:
- portal configuration
- DNS setup
- local portal deployment

---

# Recommended Commands

## Build Frontend

```bash
npm run build
```

---

# Deploy

```bash
site-builder deploy --epochs 1 dist/
```

---

# View Sitemap

```bash
site-builder sitemap --id <OBJECT_ID>
```

---

# Convert Site ID

```bash
site-builder convert <OBJECT_ID>
```

---

# Best Practices

- Always deploy build folders
- Preserve ws-resources.json
- Use deploy instead of publish/update
- Use quilts for optimized uploads
- Configure markdown exports properly
- Rebuild before redeploying
- Keep routes deterministic
- Avoid unnecessary assets
- Keep portals tested locally
- Separate testnet and mainnet configs

---

# Use Cases

- Decentralized frontend hosting
- AI-readable documentation sites
- Knowledge base hosting
- Static Web3 websites
- Decentralized documentation portals
- Agent-readable markdown exports
- Sui ecosystem portals
- Permanent static content hosting

---

# References

Walrus Sites deployment examples and CLI references sourced from:
- Walrus Sites deployment documentation :contentReference[oaicite:0]{index=0}
- Site Builder CLI reference :contentReference[oaicite:1]{index=1}