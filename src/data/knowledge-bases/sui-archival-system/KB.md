---
name: walrus-sui-archival-system
description: Build scalable archival infrastructure for Sui checkpoints using Walrus decentralized storage. Use when working on checkpoint ingestion, Walrus blob publishing, RocksDB/PostgreSQL archival state management, checkpoint lifecycle automation, metadata snapshots, blob extension workflows, REST APIs, or resilient distributed archival systems on Sui.
category: Storage Infrastructure
topic: decentralized-storage
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Sui
  - Decentralized Storage
  - Archival
  - Checkpoints
  - Rust
  - Blob Storage
  - Data Availability
---

# Walrus Sui Archival System

## Scope

Use this skill for end-to-end Sui archival infrastructure powered by Walrus:
- Sui checkpoint archival systems
- Walrus blob publishing pipelines
- Distributed archival infrastructure
- Checkpoint ingestion workflows
- RocksDB archival state management
- PostgreSQL dual-write support
- Walrus blob lifecycle management
- Checkpoint downloader systems
- REST API archival services
- Metadata snapshot generation
- Blob extension automation
- Fault-tolerant checkpoint storage
- Distributed blob consistency validation
- Sui + Walrus scalable storage systems

---

# Stack

- Rust
- Tokio
- Walrus SDK
- Sui SDK
- RocksDB
- PostgreSQL
- REST APIs
- Prometheus Metrics
- Async Workers
- Multi-thread Runtime

---

# Repo Map

- Main archival runtime:
  - `src/archival.rs`
- Checkpoint monitor:
  - `checkpoint_monitor`
- Blob publisher:
  - `checkpoint_blob_publisher`
- Blob extender:
  - `checkpoint_blob_extender`
- Snapshot creator:
  - `archival_state_snapshot_creator`
- Downloader:
  - `checkpoint_downloader`
- REST API:
  - `rest_api`
- Storage state:
  - `archival_state`
- Metrics:
  - `metrics`
- Database:
  - RocksDB
  - PostgreSQL

---

# Core Rules

1. Keep network fixed to Sui + Walrus Testnet unless explicitly requested otherwise.
2. Always store checkpoint data as deterministic Walrus blobs.
3. Preserve checkpoint ordering during ingestion and publishing.
4. Use RocksDB as the default archival state backend.
5. Enable PostgreSQL dual-write only when `DATABASE_URL` is configured.
6. Automatically extend blob lifetime before expiration.
7. Keep checkpoint download and publish flows asynchronous.
8. Use Tokio multi-thread runtime for high-throughput processing.
9. Maintain consistency validation across stored checkpoints.
10. Persist checkpoint metadata for future recovery and replay.

---

# System Architecture

```txt
Sui Checkpoints
        ↓
Checkpoint Downloader
        ↓
Checkpoint Monitor
        ↓
Blob Builder
        ↓
Walrus Blob Publisher
        ↓
Archival State Database
        ↓
Blob Extender + Snapshot Creator
```

---

# Runtime Initialization

## Multi-thread Tokio Runtime

```rust
let runtime = tokio::runtime::Builder::new_multi_thread()
    .worker_threads(config.thread_pool_size)
    .enable_all()
    .build()?;
```

---

# Main Runtime Entry

```rust
pub fn run_sui_archival(
    config: Config,
    version: &'static str
) -> Result<()> {
    tracing::info!("starting sui archival process...");

    let runtime = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(config.thread_pool_size)
        .enable_all()
        .build()?;

    runtime.block_on(async {
        run_application_logic(config, version).await
    })
}
```

---

# Walrus Client Initialization

```rust
async fn initialize_walrus_client(
    client_config: ClientConfig,
) -> Result<WalrusNodeClient<SuiContractClient>> {

    let sui_client = client_config
        .new_contract_client_with_wallet_in_config(None)
        .await?;

    let walrus_client =
        WalrusNodeClient::new_contract_client_with_refresher(
            client_config,
            sui_client
        ).await?;

    Ok(walrus_client)
}
```

---

# Walrus Read Client

```rust
async fn initialize_walrus_read_client(
    client_config: ClientConfig,
    walrus_client: &WalrusNodeClient<SuiContractClient>,
) -> Result<WalrusNodeClient<SuiReadClient>> {

    let read_client =
        walrus_client.sui_client().read_client().clone();

    let walrus_read_client =
        WalrusNodeClient::new_read_client_with_refresher(
            client_config,
            read_client
        ).await?;

    Ok(walrus_read_client)
}
```

---

# RocksDB Initialization

```rust
let mut archival_state =
    ArchivalState::open(&config.db_path, false)?;
```

---

# PostgreSQL Dual Write

```rust
match create_shared_pool_from_env() {
    Ok(pool) => {
        archival_state.set_postgres_pool(pool);
    }

    Err(e) => {
        tracing::info!(
            "PostgreSQL not configured: {}",
            e
        );
    }
};
```

---

# Metrics Setup

```rust
let registry_service =
    mysten_metrics::start_prometheus_server(
        config.metrics_address
    );

let registry = registry_service.default_registry();
```

---

# Checkpoint Download Pipeline

```txt
Downloader
    ↓
Checkpoint Receiver
    ↓
Checkpoint Monitor
    ↓
Blob Publisher
```

---

# Blob Publishing Pipeline

```txt
Checkpoint Data
      ↓
BlobBuildRequest
      ↓
CheckpointBlobPublisher
      ↓
Walrus Upload
      ↓
Metadata Persistence
```

---

# Blob Extension Pipeline

```txt
Stored Blob
      ↓
Expiration Detection
      ↓
CheckpointBlobExtender
      ↓
Lifetime Extension
```

---

# Metadata Recovery Example

```rust
match crate::util::load_checkpoint_blob_infos_from_metadata(
    &config.client_config_path,
    config.archival_state_snapshot
        .metadata_pointer_object_id,
    &config.context,
).await
```

---

# Cleanup Logic

```rust
async fn cleanup_orphaned_downloaded_checkpoints_and_uploaded_blobs(
    initial_checkpoint: CheckpointSequenceNumber,
    downloaded_checkpoint_dir: PathBuf,
) -> Result<()>
```

---

# Validation Checklist

- Tokio runtime initializes successfully
- Walrus client connects successfully
- RocksDB initializes correctly
- PostgreSQL dual-write works
- Checkpoints download continuously
- Blob publishing succeeds
- Blob extension works correctly
- Snapshot creation succeeds
- REST API responds correctly
- Metrics endpoint exports properly
- Consistency checker validates archival state

---

# Common Fixes

## Downloader Failure

- Verify ingestion service
- Verify checkpoint source
- Verify network connectivity

## Blob Upload Failure

- Verify Walrus client config
- Verify uploader wallets
- Verify upload permissions

## RocksDB Failure

- Verify database path
- Verify filesystem permissions
- Verify database consistency

## PostgreSQL Failure

- Verify:
  - `DATABASE_URL`
- Run migrations
- Verify connection pool

## Snapshot Recovery Failure

- Verify metadata blob exists
- Verify Walrus read client
- Verify object ID references

## Blob Expiration Issues

- Verify blob extender worker
- Verify extension thresholds
- Verify Walrus token configuration

---

# Recommended Commands

## Build

```bash
cargo build --release
```

## Run

```bash
cargo run --release
```

## Run with Logs

```bash
RUST_LOG=info cargo run --release
```

---

# Best Practices

- Keep checkpoint ingestion asynchronous
- Preserve deterministic checkpoint ordering
- Use metadata snapshots for recovery
- Separate ingestion and publishing workers
- Monitor blob expiration continuously
- Enable metrics for all workers
- Keep RocksDB optimized for sequential writes
- Use PostgreSQL for scalable analytics
- Design archival systems for replayability
- Maintain fault tolerance across upload flows