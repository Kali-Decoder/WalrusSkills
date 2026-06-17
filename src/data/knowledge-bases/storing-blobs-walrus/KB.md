---
name: Storing Blobs on Walrus
description: Store files on Walrus with the CLI — blob IDs, Sui object IDs, lifetimes, permanence, optimizations, and upload relay.
category: Blockchain Fundamentals
topic: walrus-client
author: WalSkills
version: "1.0.0"
tags:
  - Walrus
  - Blob Storage
  - CLI
  - Upload
  - Epochs
  - Upload Relay
---

# Storing Blobs

**Source:** https://docs.wal.app/docs/walrus-client/storing-blobs

All blobs stored in Walrus are **public and discoverable**. For sensitive data, encrypt with [Seal](https://docs.wal.app/docs/data-security#seal-data-confidentially-and-access-control) or [Nautilus](https://docs.wal.app/docs/data-security#nautilus-secure-and-verifiable-off-chain-computation) before storing.

---

## Store Command

```sh
walrus store <FILES> --epochs <EPOCHS>
```

### Multiple files / globs

```sh
walrus store *.png --epochs <EPOCHS>
```

---

## After Upload — Two Identifiers

```sh
Blob ID: oehkoh0352bRGNPjuwcy0nye3OLKT649K62imdNAlXg
Sui object ID: 0x1c086e216c4d35bf4c1ea493aea701260ffa5b0070622b17271e4495a030fe83
```

| Identifier | Use |
|------------|-----|
| **Blob ID** | Read blob data; content-derived (same file → same ID) |
| **Sui Object ID** | Modify metadata, extend lifetime, ownership |

---

## Blob Lifetimes

Three methods to set lifetime:

### 1. `--epochs <EPOCHS>`

Number of epochs to store. Upper limit: **53 epochs (~2 years)**. Use `--epochs max` for maximum duration.

End epoch = current epoch + specified epochs.

### 2. `--earliest-expiry-time <TIME>`

Date in RFC 3339 (`2024-03-20T15:00:00Z`) or relaxed format (`2024-03-20 15:00:00`). Ensures blob expires after the date if possible.

### 3. `--end-epoch <END_EPOCH>`

Specific end epoch for the blob.

### Expiry behavior

A blob expires at the **beginning** of its end epoch. Storing with `--epochs 1` right before an epoch change can expire almost immediately. Extend blobs only if they have **not** expired.

---

## Blob Permanence

| Mode | Flag | Behavior |
|------|------|----------|
| **Deletable** | default | Owner can delete before expiry |
| **Permanent** | `--permanent` | Cannot delete before expiry epoch |
| **Deletable** | `--deletable` | Explicit deletable mode |

Newly stored blobs are **deletable by default**.

---

## Automatic Optimizations

When storing, the client may:

- **Skip re-upload** if blob already stored as permanent for sufficient epochs (override with `--force`)
- **Reuse storage resource** from wallet if suitable size/duration exists
- **Skip sending encoded data** if blob already certified but deletable or insufficient epochs — collects certificate only

---

## Upload Relay

For clients with limited bandwidth (e.g. browsers), use a third-party upload relay:

```sh
walrus store <FILES> --epochs <EPOCHS> --upload-relay <RELAY_URL>
```

- Available in Walrus CLI **v1.29+**
- Relay encodes blob and sends slivers to storage nodes
- Onchain asset management still on client
- Relay may require a fee/tip — CLI shows amount and asks confirmation

Details: https://docs.wal.app/docs/operator-guide/upload-relay

---

## Share on Store

Create a shared blob immediately when storing:

```sh
walrus store <FILE> --epochs <EPOCHS> --share
```

---

## References

- Extend lifetime: https://docs.wal.app/docs/walrus-client/managing-blobs#extend-the-lifetime-of-a-blob
- Delete blobs: https://docs.wal.app/docs/walrus-client/managing-blobs#delete-blobs
- Storage costs: https://docs.wal.app/docs/system-overview/storage-costs
