---
name: Reading Blobs from Walrus
description: Query blob status and read blob data with the Walrus CLI — availability checks, consistency verification, and output options.
category: Blockchain Fundamentals
topic: walrus-client
author: WalSkills
version: "1.0.0"
tags:
  - Walrus
  - Blob Storage
  - CLI
  - Read
  - Aggregator
  - Consistency
---

# Reading Blobs

**Source:** https://docs.wal.app/docs/walrus-client/reading-blobs

---

## Check Blob Status

```sh
walrus blob-status --blob-id <BLOB_ID>
walrus blob-status --file <FILE>
```

Returns whether the blob is stored and its **availability period**. With `--file`, the CLI re-encodes the file and derives the blob ID before checking.

When available, output includes the **`BlobCertified` Sui event ID** (transaction ID + sequence number) certifying availability.

---

## Read Blob Data

```sh
walrus read <BLOB_ID>
```

| Option | Purpose |
|--------|---------|
| `--out <OUT>` | Write to file instead of stdout |
| `--rpc-url <URL>` | Override Sui RPC node |

Default: blob data written to **standard output**.

---

## Consistency Checks

Walrus performs integrity and consistency checks so read data matches what the writer intended.

### CLI versions

| Version | Default check |
|---------|---------------|
| Before `v1.37` | Strict consistency check always |
| `v1.37+` | Performant check (default); sufficient for most cases |

### Flags

```sh
walrus read <BLOB_ID> --strict-consistency-check
walrus read <BLOB_ID> --skip-consistency-check
```

- **`--strict-consistency-check`** — full strict check (pre-v1.37 behavior)
- **`--skip-consistency-check`** — disable checks; only use when writer is known and trusted

Details: https://docs.wal.app/docs/system-overview/red-stuff

---

## HTTP / Aggregator Access

End users and apps often read blobs via **aggregator** HTTP endpoints:

```text
GET /v1/blobs/<BLOB_ID>
```

The CLI `read` command interacts with Walrus storage directly; aggregators expose HTTP for browsers and SDKs.

---

## Quick Reference

```sh
# Check if blob exists
walrus blob-status --blob-id <BLOB_ID>

# Download to file
walrus read <BLOB_ID> --out ./downloaded.bin

# Check status from local file (derives blob ID)
walrus blob-status --file ./myfile.png
```
