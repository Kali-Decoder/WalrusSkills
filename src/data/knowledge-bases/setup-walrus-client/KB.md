---
name: Setup Walrus Client
description: Install and configure the Walrus CLI — suiup, client_config.yaml, contexts, wallet, gas budget, JSON mode, and logging.
category: Deployment & Infra
topic: walrus-client
author: WalSkills
version: "1.0.0"
tags:
  - Walrus
  - CLI
  - suiup
  - Configuration
  - Sui
  - Testnet
  - Mainnet
---

# Walrus Client

**Source:** https://docs.wal.app/docs/walrus-client/walrus-cli

Use the command-line interface (CLI) to interact with the Walrus client. The CLI is available by installing the `walrus` binary.

---

## Install

Install Mysten Labs `suiup`:

```sh
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
```

Install `sui` and `walrus`:

```sh
suiup install sui
suiup install walrus
```

View usage:

```sh
walrus --help
```

Each subcommand supports `--help` for arguments and meanings.

---

## Switching Contexts

If you have multiple contexts in your configuration, specify the context per command:

```sh
walrus --context testnet store file.png --epochs 1
```

Generate shell completion:

```sh
walrus completion
```

Place the script in an appropriate directory (e.g. `~/.local/share/bash-completion/completions`).

---

## Configuration

The Walrus client needs Sui objects that store Walrus system and staking information in **`client_config.yaml`**.

### Default search paths

The client looks for `client_config.yaml` (or `client_config.yml`) in:

1. Current directory
2. `$XDG_CONFIG_HOME/walrus/`
3. `~/.config/walrus/`
4. `~/.walrus/`

### Download latest config

```sh
curl --create-dirs https://docs.wal.app/setup/client_config.yaml -o ~/.config/walrus/client_config.yaml
```

You can place the file anywhere — use `--config <PATH>` when running `walrus`.

### Example configuration (Testnet + Mainnet)

```yaml
contexts:
  mainnet:
    system_object: 0x2134d52768ea07e8c43570ef975eb3e4c27a39fa6396bef985b5abc58d03ddd2
    staking_object: 0x10b9d30c28448939ce6c4d6c6e0ffce4a7f8a4ada8248bdad09ef8b70e4a3904
    n_shards: 1000
    max_epochs_ahead: 53
    wallet_config:
      active_env: mainnet
    rpc_urls:
      - https://fullnode.mainnet.sui.io:443
  testnet:
    system_object: 0x6c2547cbbc38025cf3adac45f63cb0a8d12ecf777cdc75a4971612bf97fdf6af
    staking_object: 0xbe46180321c30aab2f8b3501e24048377287fa708018a5b7c2792b35fe339ee3
    exchange_objects:
      - 0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073
      - 0x19825121c52080bb1073662231cfea5c0e4d905fd13e95f21e9a018f2ef41862
      - 0x83b454e524c71f30803f4d6c302a86fb6a39e96cdfb873c2d1e93bc1c26a3bc5
      - 0x8d63209cf8589ce7aef8f262437163c67577ed09f3e636a9d8e0813843fb8bf1
    n_shards: 1000
    max_epochs_ahead: 53
    wallet_config:
      active_env: testnet
    rpc_urls:
      - https://fullnode.testnet.sui.io:443
default_context: testnet
```

Upstream reference: https://github.com/MystenLabs/walrus/blob/main/setup/client_config.yaml

---

## CLI Options

### Specify a wallet

```sh
walrus --wallet <WALLET> ...
```

Wallet config is taken from the Walrus config path, `./sui_config.yaml`, or `~/.sui/sui_config/client.yaml`.

### Set a gas budget

```sh
walrus --gas-budget <GAS_BUDGET> ...
```

Maximum Sui (in MIST) the command may use. If omitted, gas is estimated automatically.

### Print output as JSON

```sh
walrus --json ...
```

Default in JSON mode. See https://docs.wal.app/docs/walrus-client/json-mode

---

## Logging and Metrics

Toggle log levels via environment variable:

```sh
RUST_LOG=walrus=trace walrus info
```

Default: `info` level. Use `debug` and `trace` for deeper diagnostics.

---

## Quick Checklist

- [ ] `suiup` installed
- [ ] `sui` and `walrus` binaries installed
- [ ] `client_config.yaml` in `~/.config/walrus/`
- [ ] Sui wallet configured (`~/.sui/sui_config/client.yaml`)
- [ ] Testnet/Mainnet tokens available
- [ ] `walrus --help` runs successfully
