---
name: walrus-storage-node-migration
description: Migrate a Walrus storage node to new infrastructure safely while preserving databases, node identity, TLS configuration, and Walrus services. Use when moving Walrus storage nodes, aggregators, publishers, or databases between servers.
category: Infrastructure
topic: node-migration
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Sui
  - Storage Node
  - Migration
  - Infrastructure
  - DevOps
  - TLS
  - Rsync
  - Database
---

# Walrus Storage Node Migration

## Scope

Use this skill for migrating Walrus infrastructure to new hardware:
- Walrus storage node migration
- Aggregator migration
- Publisher migration
- Database migration
- TLS migration
- Node identity preservation
- Infrastructure replacement
- Disaster recovery workflows
- Production node transfer
- Rsync-based synchronization
- Blob database preservation

---

# Prerequisites

Required before migration:

- New host prepared using:
  - Storage Node Setup Guide
- TLS setup completed
- systemd services configured
- SSH access from new host → old host
- Do NOT run:
  - `walrus-node setup`
  - `walrus-node register`

on the new host before migration.

---

# Recommended Directory Structure

```txt
/opt/walrus
    ├── bin
    ├── config
    ├── db
    ├── logs
    └── wallets
```

---

# Core Rules

1. Never register a migrated node again.
2. Preserve the original node identity and keys.
3. Always stop services cleanly before final sync.
4. Never rsync a live-writing database.
5. Preserve `/opt/walrus/config`.
6. Preserve `/opt/walrus/db`.
7. Preserve TLS certificates and keys.
8. Keep original wallet files unchanged.
9. Verify database integrity before production startup.
10. Never start with an empty database unless absolutely necessary.

---

# Migration Workflow

```txt
Old Host
    ↓
Initial Rsync Transfer
    ↓
Stop Services
    ↓
Final Rsync Sync
    ↓
DNS Update
    ↓
Start New Node
    ↓
Verify Health
```

---

# Step 1: Switch to Walrus User

```bash
sudo su walrus
```

---

# Step 2: Configure Old Host Variables

```bash
OLD_HOST=old-server-ip-or-domain

OLD_USER=walrus
```

---

# Step 3: Verify SSH Connectivity

```bash
ssh $OLD_USER@$OLD_HOST
```

---

# Step 4: First Transfer

Initial sync while old node remains online.

```bash
rsync -avz --progress \
  $OLD_USER@$OLD_HOST:/opt/walrus/ \
  /opt/walrus
```

---

# Step 5: Stop Old Services

Stop services cleanly on the old host.

## Stop Storage Node

```bash
sudo systemctl stop walrus-node.service
```

---

## Stop Aggregator

```bash
sudo systemctl stop walrus-aggregator.service
```

---

## Stop Publisher

```bash
sudo systemctl stop walrus-publisher.service
```

---

# Important Warning

Never run rsync against an actively writing database.

Improper shutdown may corrupt:
- RocksDB
- event storage
- blob indexes

Always wait for services to fully stop.

---

# Step 6: Final Synchronization

Synchronize remaining changes using `--delete`.

```bash
rsync -avz --delete --progress \
  $OLD_USER@$OLD_HOST:/opt/walrus/ \
  /opt/walrus
```

---

# Step 7: Update DNS Records

Update DNS entries to point to the new infrastructure.

Verify:
- public IP
- TLS hostname
- aggregator endpoints
- publisher endpoints

---

# Step 8: Download Latest Binaries

Download latest:
- walrus
- walrus-node

binaries on the new host.

```bash
cd /opt/walrus/bin

for BIN in walrus walrus-node; do
  curl -L \
    "https://storage.googleapis.com/mysten-walrus-binaries/$BIN-mainnet-latest-ubuntu-x86_64" \
    -o $BIN

  chmod 0755 $BIN
done
```

---

# Step 9: Verify Transferred Data

Verify:

## Config Files

```txt
/opt/walrus/config
```

---

## Wallet Files

```txt
/opt/walrus/wallets
```

---

## Database

```txt
/opt/walrus/db
```

Check:
- directory structure
- file sizes
- event storage
- RocksDB integrity

---

# Step 10: Update Hostname

If using a new hostname:

Update:

```yaml
public_host:
```

inside:

```txt
/opt/walrus/config/walrus-node.yaml
```

---

# Step 11: Start Services

## Reload Systemd

```bash
sudo systemctl daemon-reload
```

---

## Start Storage Node

```bash
sudo systemctl enable --now walrus-node.service
```

---

## Start Aggregator

```bash
sudo systemctl enable --now walrus-aggregator.service
```

---

## Start Publisher

```bash
sudo systemctl enable --now walrus-publisher.service
```

---

# Step 12: Migrate Reverse Proxy

If applicable:
- nginx
- caddy
- traefik

Move:
- configs
- TLS settings
- proxy rules

Then restart proxy services.

---

# Health Verification

## External Health Check

```bash
curl https://PUBLIC_ADDRESS:9185/v1/health | jq
```

Expected:
- `nodeStatus: Active`
- persisted event counts
- healthy JSON response

---

# Verify Onchain Key

```bash
/opt/walrus/bin/walrus \
  --config /opt/walrus/config/client_config.yaml \
  health \
  --node-id YOUR_NODE_ID
```

---

# Verify Event Count

Healthy databases should contain:
- tens of millions of persisted events

If event count is extremely low:
- stop node immediately
- verify database integrity

---

# Database Corruption Recovery

## Retry Rsync

Run final rsync again.

```bash
rsync -avz --delete --progress \
  $OLD_USER@$OLD_HOST:/opt/walrus/ \
  /opt/walrus
```

---

# Rebuild Event Blob Storage

Delete:

```txt
/opt/walrus/db/events
```

or:

```txt
/opt/walrus/db/event_blob_writer
```

These rebuild automatically.

---

# Repair Database

```bash
/opt/walrus/bin/walrus-node \
  db-tool repair-db \
  --db-path /opt/walrus/db
```

---

# Aggregator Test

```bash
curl https://AGGREGATOR_ADDRESS/v1/blobs/BLOB_ID
```

---

# Publisher Test

```bash
curl -X PUT \
  https://PUBLISHER_ADDRESS/v1/blobs \
  -d "test"
```

---

# Cleanup Old Host

Only after full verification:

```bash
rm -rf /opt/walrus
```

on the old host.

---

# Validation Checklist

- Initial rsync completed
- Old services stopped cleanly
- Final rsync completed
- DNS updated
- TLS certificates migrated
- Wallet files preserved
- Database integrity verified
- Node health endpoint operational
- Aggregator functioning
- Publisher functioning
- Onchain key validation successful

---

# Common Fixes

## Database Corruption

- Retry rsync
- Repair RocksDB
- Rebuild event directories

---

## Node Identity Mismatch

- Verify wallet files
- Verify config migration
- Verify TLS key migration

---

## Health Endpoint Failure

- Verify DNS
- Verify firewall rules
- Verify TLS certificates

---

## Aggregator Failure

- Verify reverse proxy
- Verify blob database
- Verify network ports

---

## Publisher Failure

- Verify TLS
- Verify upload routes
- Verify storage permissions

---

# Recommended Commands

## Check Service Status

```bash
systemctl status walrus-node
```

---

## Follow Logs

```bash
journalctl -fu walrus-node
```

---

## Restart Services

```bash
sudo systemctl restart walrus-node
```

---

## Health Check

```bash
curl -sk https://localhost:9185/v1/health | jq
```

---

# Best Practices

- Always perform dual rsync migration
- Preserve original wallet files
- Never re-register migrated nodes
- Keep TLS certificates identical
- Verify health before DNS cutover
- Monitor database integrity closely
- Keep backups before migration
- Avoid empty database recovery unless required
- Use dedicated disks for blob databases
- Verify event counts after startup