---
name: Walrus Quilts
description: Store and read many small blobs efficiently with Walrus quilts — store-quilt, read-quilt, QuiltPatchId, identifiers, and tags.
category: Blockchain Fundamentals
topic: walrus-client
author: WalSkills
version: "1.0.0"
tags:
  - Walrus
  - Quilts
  - CLI
  - Walrus Sites
  - Blob Storage
  - QuiltPatchId
---

# Using Quilts with the Walrus Client

**Source:** https://docs.wal.app/docs/walrus-client/quilts

For efficiently storing large numbers of small blobs, Walrus provides **quilts**. A quilt batches multiple blobs into a single storage unit, reducing overhead and cost.

Learn more: https://docs.wal.app/docs/system-overview/quilt

---

## Key Concepts

- Blobs in a quilt are retrieved by **`QuiltPatchId`**, not standard `BlobId`
- `QuiltPatchId` depends on all blobs in the quilt — changes if blob moves to different quilt
- Operations like `delete`, `extend`, or `share` apply to the **entire quilt**, not individual patches
- Walrus Sites uses quilts for small site files

---

## Store Files as a Quilt

### From directories (recursive)

```sh
walrus store-quilt --epochs <EPOCHS> --paths <DIR_1> <DIR_2> <FILE>
```

Filename = unique identifier within quilt. Regex supported for multiple paths.

Duration: `--epochs`, `--earliest-expiry-time`, or `--end-epoch` (same as `store`).

All identifiers must be **unique** within the quilt.

### From JSON blob list

```sh
walrus store-quilt \
  --blobs '{"path":"<PATH_1>","identifier":"walrus","tags":{"color":"grey","size":"medium"}}' \
          '{"path":"<PATH_2>","identifier":"seal","tags":{"color":"grey","size":"small"}}' \
  --epochs <EPOCHS>
```

- `identifier`: custom name (defaults to filename if null/omitted)
- `tags`: optional key-value metadata per blob

---

## Read Blobs from a Quilt

Retrieve individual blobs without downloading the entire quilt.

### By identifiers

```sh
walrus read-quilt --out <DOWNLOAD_DIR> \
  --quilt-id <QUILT_ID> --identifiers walrus.jpg another-walrus.jpg
```

### By tags

```sh
walrus read-quilt --out <DOWNLOAD_DIR> \
  --quilt-id <QUILT_ID> --tag species cat
```

### By QuiltPatchId

```sh
walrus read-quilt --out <DOWNLOAD_DIR> \
  --quilt-patch-ids <PATCH_ID_1> <PATCH_ID_2>
```

Get patch IDs with `list-patches-in-quilt`.

---

## List Patches in a Quilt

```sh
walrus list-patches-in-quilt <QUILT_ID>
```

Shows all patches with identifiers and `QuiltPatchIds`.

---

## Quilts vs Standard Blobs

| Aspect | Standard blob | Quilt patch |
|--------|---------------|-------------|
| ID | Blob ID | QuiltPatchId |
| Best for | Large single files | Many small files |
| Update | Per blob | Entire quilt re-upload |
| Delete/extend | Per blob object | Whole quilt only |
| Cost | Higher per small file | Lower batch overhead |

---

## Walrus Sites Connection

When deploying Walrus Sites, `site-builder` stores files as quilts. Deploy output shows **quilt patch IDs** per resource:

```sh
created resource /index.html with quilt patch ID BjJAfHLJKMDZ0tFZaLKVw0R74re5RG65-xNhaZ5uwowBDAAZAA
```

Updating any site file re-uploads the **entire quilt**.

---

## References

- Quilt system overview: https://docs.wal.app/docs/system-overview/quilt
- Storing blobs: https://docs.wal.app/docs/walrus-client/storing-blobs
- Walrus Sites deploy: https://docs.wal.app/docs/sites/getting-started/publishing-your-first-site
