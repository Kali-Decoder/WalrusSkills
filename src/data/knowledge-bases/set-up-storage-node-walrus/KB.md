---
name: walrus-storage-node-setup
description: Set up and operate a Walrus storage node on Sui including TLS configuration, node registration, pricing configuration, systemd services, health checks, and production-ready infrastructure management.
category: Infrastructure
topic: storage-node
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Sui
  - Storage Node
  - Infrastructure
  - Rust
  - DevOps
  - TLS
  - Validators
  - Blob Storage
---

# Walrus Storage Node Setup

## Scope

Use this skill for production-grade Walrus storage node deployment and operations:
- Walrus storage node setup
- TLS certificate management
- Node registration workflows
- Systemd service configuration
- Sui wallet configuration
- Blob storage infrastructure
- Pricing configuration
- Walrus node health monitoring
- Metrics setup
- Production infrastructure deployment
- Storage capacity configuration
- WAL pricing configuration
- RocksDB storage infrastructure

---

# Prerequisites

Required system specifications:

- Ubuntu 24.04 recommended
- Linux x86_64
- AVX2 support
- SSSE3 support
- Public IP address
- DNS hostname
- Large storage partition mounted at:
  - `/opt/walrus/db`

---

# Recommended Directory Structure

```txt
/opt/walrus
    ├── bin
    ├── config
    ├── db
    └── logs
```

---

# Core Rules

1. Always use dedicated wallets per network.
2. Never reuse testnet keys in production.
3. Use HTTPS/TLS directly on Walrus node.
4. Do not use self-signed certificates.
5. Keep WAL price monitoring enabled for stable pricing.
6. Use RocksDB-backed blob storage.
7. Always configure automatic TLS renewal.
8. Use systemd for production deployments.
9. Enable health monitoring and metrics.
10. Keep blob storage mounted on dedicated disks.

---

# TLS Setup

## Install Certbot

```bash
sudo snap install --classic certbot --channel=edge
```

---

# Set Server Name

```bash
SERVER_NAME=your-node-domain.com
```

---

# Verify DNS

```bash
curl ifconfig.me; echo

dig +short $SERVER_NAME
```

---

# TLS Deploy Hook

## `/opt/walrus/bin/tls-deploy-hook.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

WALRUS_TLS_DIR="$1"

TLS_SOURCE_DIR="$RENEWED_LINEAGE"

rm -f "$WALRUS_TLS_DIR/cert.pem" \
      "$WALRUS_TLS_DIR/chain.pem" \
      "$WALRUS_TLS_DIR/fullchain.pem" \
      "$WALRUS_TLS_DIR/privkey.pem"

/usr/bin/env cp -rL "$TLS_SOURCE_DIR"/* "$WALRUS_TLS_DIR/"

/usr/bin/env chown walrus:walrus \
    "$WALRUS_TLS_DIR"/*
```

---

# Set TLS Script Permissions

```bash
sudo chown walrus \
  /opt/walrus/bin/tls-deploy-hook.sh

sudo chmod u=rwx,g=rx,o=rx \
  /opt/walrus/bin/tls-deploy-hook.sh
```

---

# Dry Run TLS Certificate

```bash
sudo certbot certonly --standalone \
  --reuse-key \
  --key-type ecdsa \
  --elliptic-curve=secp256r1 \
  --domain $SERVER_NAME \
  --cert-name walrus-storage-node \
  --deploy-hook="/opt/walrus/bin/tls-deploy-hook.sh /opt/walrus/config/tls" \
  --dry-run
```

---

# Obtain Production Certificate

```bash
sudo certbot certonly --standalone \
  --reuse-key \
  --key-type ecdsa \
  --elliptic-curve=secp256r1 \
  --domain $SERVER_NAME \
  --cert-name walrus-storage-node \
  --deploy-hook="/opt/walrus/bin/tls-deploy-hook.sh /opt/walrus/config/tls"
```

---

# Install Jemalloc

```bash
sudo apt-get install libjemalloc2
```

---

# Systemd Service

## `/etc/systemd/system/walrus-node.service`

```ini
[Unit]
Description=Walrus Node

[Service]
User=walrus

Environment=RUST_BACKTRACE=1
Environment=RUST_LOG=info

Environment="LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

ExecStart=/opt/walrus/bin/walrus-node run \
  --config-path /opt/walrus/config/walrus-node.yaml

Restart=always

TimeoutStopSec=300

LimitNOFILE=4294967296

[Install]
WantedBy=multi-user.target
```

---

# Switch to Walrus User

```bash
sudo su walrus
```

---

# Network Selection

## Mainnet

```bash
NETWORK=mainnet
```

## Testnet

```bash
NETWORK=testnet
```

---

# Download Walrus Binaries

```bash
cd /opt/walrus/bin

for BIN in walrus walrus-node; do
  curl -L \
    "https://storage.googleapis.com/mysten-walrus-binaries/$BIN-$NETWORK-latest-ubuntu-x86_64" \
    -o $BIN

  chmod 0755 $BIN
done
```

---

# Verify Versions

```bash
./walrus-node -V

./walrus -V
```

---

# Download Client Config

```bash
CLIENT_CONFIG=/opt/walrus/config/client_config.yaml

curl \
  "https://docs.wal.app/setup/client_config_$NETWORK.yaml" \
  -o $CLIENT_CONFIG
```

---

# Extract System Objects

```bash
SYSTEM_OBJECT=$(awk '/^system_object:/ {print $2}' $CLIENT_CONFIG)

STAKING_OBJECT=$(awk '/^staking_object:/ {print $2}' $CLIENT_CONFIG)
```

---

# Configure Node Variables

```bash
NODE_CAPACITY=3.14TiB

NODE_NAME="Walrus Storage Node"

PUBLIC_PORT=9185

SUI_RPC_URL=https://fullnode.mainnet.sui.io
```

---

# Generate Node Configuration

```bash
/opt/walrus/bin/walrus-node setup \
  --sui-network "$SUI_RPC_URL" \
  --config-directory /opt/walrus/config \
  --storage-path /opt/walrus/db \
  --sui-rpc "$SUI_RPC_URL" \
  --system-object "$SYSTEM_OBJECT" \
  --staking-object "$STAKING_OBJECT" \
  --node-capacity "$NODE_CAPACITY" \
  --public-host $SERVER_NAME \
  --public-port $PUBLIC_PORT \
  --name "$NODE_NAME" \
  --network-key-path /opt/walrus/config/tls/privkey.pem \
  --certificate-path /opt/walrus/config/tls/fullchain.pem \
  --metrics-push-url "https://walrus-metrics-$NETWORK.mystenlabs.com/publish/metrics" \
  --checkpoint-bucket "https://checkpoints.$NETWORK.sui.io" \
  --force
```

---

# Pricing Configuration

## FROST Pricing

```yaml
voting_params:
  currency: Frost
  storage_price: 11000
  write_price: 20000
```

---

# NanoUSD Stable Pricing

```yaml
voting_params:
  currency: NanoUsd
  storage_price: 11000
  write_price: 20000
  price_update_threshold_percent: 10
```

---

# WAL Price Monitor

```yaml
wal_price_monitor:
  check_interval_secs: 600

  request_timeout_secs: 60

  force_enable_wal_price_monitor: false
```

---

# Register Node

```bash
/opt/walrus/bin/walrus-node register \
  --config-path /opt/walrus/config/walrus-node.yaml
```

---

# Start Node

```bash
sudo systemctl daemon-reload

sudo systemctl enable --now walrus-node.service
```

---

# Verify Node Status

```bash
sudo systemctl status walrus-node.service
```

---

# Monitor Logs

```bash
journalctl -efu walrus-node
```

---

# Health Check

## External Health Check

```bash
curl https://PUBLIC_ADDRESS:9185/v1/health | jq
```

---

## Localhost Health Check

```bash
curl -sk https://localhost:9185/v1/health | jq
```

---

# Verify Onchain Key

```bash
/opt/walrus/bin/walrus \
  --config /opt/walrus/config/client_config.yaml \
  health \
  --node-id YOUR_NODE_ID
```

---

# Validation Checklist

- TLS certificates configured
- Certbot auto-renewal enabled
- Walrus binaries installed
- Systemd service active
- Storage path mounted correctly
- Node registration successful
- Health endpoint reachable
- Metrics endpoint configured
- WAL pricing configured
- Node wallet funded
- RocksDB storage operational

---

# Common Fixes

## TLS Failure

- Verify DNS records
- Verify certbot installation
- Verify TLS deploy hook permissions

## Node Registration Failure

- Verify SUI balance
- Verify wallet configuration
- Verify system/staking object IDs

## Health Endpoint Failure

- Verify firewall ports
- Verify TLS configuration
- Verify service is running

## Metrics Push Failure

- Expected before committee allowlisting
- Verify metrics URL

## Blob Storage Issues

- Verify mounted disk
- Verify storage permissions
- Verify RocksDB path

## WAL Price Monitor Failure

- Verify internet connectivity
- Verify pricing sources
- Verify monitor configuration

---

# Recommended Commands

## Build Status

```bash
systemctl status walrus-node
```

## Restart Node

```bash
sudo systemctl restart walrus-node
```

## Follow Logs

```bash
journalctl -fu walrus-node
```

## Check Health

```bash
curl -sk https://localhost:9185/v1/health | jq
```

---

# Best Practices

- Use dedicated storage disks
- Enable automatic TLS renewal
- Keep WAL pricing stable
- Use NanoUSD pricing for predictable costs
- Monitor health endpoints continuously
- Keep metrics enabled
- Separate testnet and mainnet wallets
- Use dedicated Sui RPC endpoints
- Keep node binaries updated
- Monitor disk usage and performance