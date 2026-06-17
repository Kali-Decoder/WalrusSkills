# Deploy a Walrus Site

Publish static websites to Walrus + Sui using the `site-builder` CLI.

## What This Skill Does

Walks your agent through the full first-deploy flow:

1. Prerequisites (Sui, Walrus, tokens, site-builder)
2. Deploy `walrus-snake` or your own static site
3. View on Testnet (local portal) or Mainnet (`wal.app` + SuiNS)
4. Update existing sites via `ws-resources.json` `object_id`
5. Deploy framework builds (`dist/`, `build/`, `out/`)

## Quick Start

```bash
git clone https://github.com/MystenLabs/example-walrus-sites.git
cd example-walrus-sites

site-builder --context=testnet deploy ./walrus-snake --epochs 1
```

Browse Testnet sites through a [local portal](https://docs.wal.app/docs/sites/portals/deploy-locally).

## Framework Deploy

```bash
npm run build
site-builder --context=testnet deploy --epochs 1 my-website/dist
```

Never deploy `node_modules/` or source folders.

## Key Rules

- `index.html` required at site root
- Preserve `ws-resources.json` after first deploy
- Whole quilt re-uploads on every update
- Rebuild before redeploying framework sites

## Installation

```
your-project/
└── .claude/skills/
    └── deploy-walrus-site/
        ├── SKILL.md
        └── README.md
```

## Docs

https://docs.wal.app/docs/sites/getting-started/publishing-your-first-site
