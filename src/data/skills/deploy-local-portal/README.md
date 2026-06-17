# Deploy a Local Portal

Run a Walrus Sites Portal on your machine to browse decentralized sites stored on Walrus and registered on Sui.

## What This Skill Does

Guides your agent through deploying a **Sites Portal** locally — either with **Docker** (quickest) or **bun** for server-side or service-worker development. A portal fetches site resources from Walrus and Sui before rendering them in the browser.

## Why You Need a Local Portal

- **Testnet** has no public portal — you must self-host to view Testnet sites.
- **Mainnet** public access via `wal.app` requires SuiNS; a local portal lets you test before DNS is configured.
- Useful for debugging site deployments and portal routing.

## Quick Start (Docker)

```bash
git clone https://github.com/MystenLabs/walrus-sites.git
cd walrus-sites && git checkout mainnet

# Pick your network
cp portal/server/portal-config.testnet.example.yaml portal/server/portal-config.yaml

docker run -it --rm \
  -v $(pwd)/portal/server/portal-config.yaml:/portal-config.yaml:ro \
  -e PORTAL_CONFIG=/portal-config.yaml \
  -p 3000:3000 \
  mysten/walrus-sites-server-portal:mainnet-v2.8.0
```

Open **http://localhost:3000** in your browser.

> Match the Docker image tag to your `site-builder` version:  
> `site-builder -V | awk '{ print $2 }' | awk -F - '{ printf("v%s\n", $1) }'`

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [`site-builder` configured](https://docs.wal.app/docs/sites/getting-started/installing-the-site-builder)

## Installation

Copy this folder into your project's skills directory:

```
your-project/
└── .claude/skills/
    └── deploy-local-portal/
        ├── SKILL.md
        └── README.md
```

## Docs

https://docs.wal.app/docs/sites/portals/deploy-locally
