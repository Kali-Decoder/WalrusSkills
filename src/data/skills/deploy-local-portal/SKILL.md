---
name: Deploy a Local Portal
description: Deploy and run a Walrus Sites Portal locally using Docker or bun. Use when browsing Walrus Sites on Testnet or Mainnet, setting up a local portal, resolving site resources from Walrus + Sui, or when public portals are unavailable.
category: Infrastructure
difficulty: intermediate
author: WalSkills
version: "1.0.0"
skills:
  - Walrus
  - Walrus Sites
  - Portal
  - Docker
  - Site Builder
  - Sui
  - Local Development
  - bun
---

# Deploy a Local Portal

**Source:** https://docs.wal.app/docs/sites/portals/deploy-locally

To view a website deployed using Walrus Sites, you must use a **Sites Portal**. A portal retrieves site resources from Walrus and their corresponding Sui objects before serving the site in your browser. You can browse any Walrus Site deployed on Mainnet or Testnet using a Sites Portal.

Use Docker to deploy a Sites Portal locally. There are no Testnet portals hosted for public good, and Mainnet sites must use a SuiNS domain name to be resolved through Walrus Foundation's public Mainnet portal.

---

## When to Use This Skill

- Browsing Walrus Sites on **Testnet** (no public Testnet portal)
- Testing Mainnet sites locally before SuiNS setup
- Debugging portal routing or site resource resolution
- Developing against `localhost:3000` (server portal) or `localhost:8080` (service-worker portal)

---

## Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. [Install and configure `site-builder`](/docs/sites/getting-started/installing-the-site-builder)

---

## Core Rules

1. Portal Docker image version **must match** your `site-builder` version.
2. Testnet sites require a **self-hosted portal** — there is no public Testnet portal.
3. Mainnet public browsing on `wal.app` requires **SuiNS** domain configuration.
4. Always copy the correct network config (`mainnet` vs `testnet`) before starting the portal.
5. Server portal runs at **`http://localhost:3000`**; service-worker portal runs at **`http://localhost:8080`**.

---

# Method 1 — Docker (Recommended)

## Clone walrus-sites

```sh
git clone https://github.com/MystenLabs/walrus-sites.git
cd walrus-sites
git checkout mainnet
```

## Copy portal config

Copy the template configuration file for your target network and rename it to `portal-config.yaml`:

### Mainnet

```sh
cp portal/server/portal-config.mainnet.example.yaml portal/server/portal-config.yaml
```

### Testnet

```sh
cp portal/server/portal-config.testnet.example.yaml portal/server/portal-config.yaml
```

## Match portal image version to site-builder

Get your `site-builder` version tag:

```bash
site-builder -V | awk '{ print $2 }' | awk -F - '{ printf("v%s\n", $1) }'
```

The output version tag must match the Docker image tag in `mysten/walrus-sites-server-portal:mainnet-v2.8.0` (replace `v2.8.0` with your version).

## Run the Docker container

```bash
docker run \
  -it \
  --rm \
  -v $(pwd)/portal/server/portal-config.yaml:/portal-config.yaml:ro \
  -e PORTAL_CONFIG=/portal-config.yaml \
  -p 3000:3000 \
  mysten/walrus-sites-server-portal:mainnet-v2.8.0
```

## Open in browser

```text
http://localhost:3000
```

---

# Method 2 — Local Development (bun)

Requires `bun`. Check installation:

```sh
bun --version
```

If `bun` is not installed:

```sh
curl -fsSL https://bun.sh/install | bash
```

## Install dependencies

```sh
git clone https://github.com/MystenLabs/walrus-sites.git
cd walrus-sites/portal
bun install
```

## Server-side portal (`localhost:3000`)

Copy the example `portal-config.yaml` for your target network:

```sh
# Mainnet
cp server/portal-config.mainnet.example.yaml server/portal-config.yaml

# Testnet
cp server/portal-config.testnet.example.yaml server/portal-config.yaml

bun run server
```

## Service-worker portal (`localhost:8080`)

Copy the example `.env.local` for your target network:

```sh
# Mainnet
cp worker/.env.mainnet.example worker/.env.local

# Testnet
cp worker/.env.testnet.example worker/.env.local

bun run build:worker
bun run worker
```

---

## Portal Workflow

```txt
Walrus Site (Sui object + Walrus blobs)
      ↓
Sites Portal fetches resources
      ↓
Portal serves site in browser
      ↓
User browses at localhost:3000 or localhost:8080
```

---

## Health Validation Checklist

- [ ] Docker installed (Docker method) or bun installed (local method)
- [ ] `site-builder` installed and configured
- [ ] `walrus-sites` repo cloned and on correct branch (`mainnet`)
- [ ] Correct `portal-config.yaml` copied for target network
- [ ] Portal Docker image version matches `site-builder` version
- [ ] Container or server starts without errors
- [ ] Portal accessible at `http://localhost:3000` (server) or `http://localhost:8080` (worker)
- [ ] Target Walrus Site loads in browser

---

## Common Fixes

### Portal image version mismatch

Run `site-builder -V` and update the Docker image tag to match:

```bash
mysten/walrus-sites-server-portal:mainnet-v<YOUR_VERSION>
```

### Wrong network config

Verify you copied `portal-config.mainnet.example.yaml` vs `portal-config.testnet.example.yaml` for your target network.

### Site not loading on Testnet

Testnet has no public portal — you **must** run a local portal.

### Mainnet site not visible on wal.app

Public Mainnet portal requires **SuiNS** domain configuration. Use a local portal for testing without SuiNS.

### Port already in use

Change the host port mapping, e.g. `-p 3001:3000`, and open `http://localhost:3001`.

---

## References

- Deploy locally: https://docs.wal.app/docs/sites/portals/deploy-locally
- Portal config examples: https://docs.wal.app/docs/sites/portals/mainnet-testnet
- Install site-builder: https://docs.wal.app/docs/sites/getting-started/installing-the-site-builder
