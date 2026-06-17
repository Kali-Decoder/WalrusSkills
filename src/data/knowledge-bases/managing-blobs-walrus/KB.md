---
name: Managing Blobs on Walrus
description: Extend, delete, burn, share, and set attributes on Walrus blobs using the CLI — lifecycle management and shared blobs.
category: Blockchain Fundamentals
topic: walrus-client
author: WalSkills
version: "1.0.0"
tags:
  - Walrus
  - Blob Storage
  - CLI
  - Delete
  - Extend
  - Shared Blobs
  - Metadata
---

# Managing Blobs

**Source:** https://docs.wal.app/docs/walrus-client/managing-blobs

Use the Walrus client to manage blobs and their metadata on Sui.

---

## Extend Blob Lifetime

```sh
walrus extend --blob-obj-id <BLOB_OBJECT_ID>
```

- Blob **must not be expired**
- **Address-owned** blobs: only owner can extend
- **Shared blobs**: anyone can extend; use `--shared` flag

Requires **Sui object ID** (not blob ID). Run `walrus extend --help` for options.

---

## Delete Blobs

Delete **deletable** blobs before expiry (owner only):

```sh
walrus delete --blob-id <BLOB_ID>
```

Alternative identifiers:

```sh
walrus delete --file <PATH>
walrus delete --object-id <SUI_ID>
```

- Asks for confirmation unless `--yes`
- Reclaims storage object for reuse
- Checks updated status after delete unless `--no-status-check`

### Privacy limitations

danger

- All Walrus blobs are **public**
- Delete only removes slivers from current/subsequent epoch storage nodes
- If another copy of the same blob exists, `walrus read` may still succeed
- Does not delete from caches or user downloads

---

## Burn Blobs

Remove the Sui object **without** deleting Walrus data or refunding storage:

```sh
walrus burn-blobs --object-ids <BLOB_OBJECT_ID>
walrus burn-blobs --all
walrus burn-blobs --all-expired
```

After burn: cannot extend permanent blobs; cannot extend or delete deletable blobs. Only wallet-owned blobs can be burned.

---

## Shared Blobs

Shared blobs are shared Sui objects wrapping `Blob` objects — anyone can fund and extend.

Contract reference: https://github.com/MystenLabs/walrus/tree/main/contracts/walrus/sources/system/shared_blob.move

### Share existing blob

```sh
walrus share --blob-obj-id <SUI_OBJ_ID>
```

Fund on creation with `--amount`, or fund later:

```sh
walrus fund-shared-blob ...
```

### Share on store

```sh
walrus store <FILE> --epochs <EPOCHS> --share
```

Shared blobs: **permanent only**, cannot delete before expiry.

---

## Blob Attributes

### Set attributes

```sh
walrus set-blob-attribute <BLOB_OBJECT_ID> --attr "key" "value"
walrus set-blob-attribute <BLOB_OBJECT_ID> --attr "key1" "value1" --attr "key2" "value2"
```

### Get attributes

```sh
walrus get-blob-attribute <BLOB_OBJECT_ID>
```

### Remove attributes

```sh
walrus remove-blob-attribute <BLOB_OBJECT_ID>
walrus remove-blob-attribute-fields <BLOB_OBJECT_ID> --keys "key1"
```

---

## Command Summary

| Action | Command |
|--------|---------|
| Extend | `walrus extend --blob-obj-id <ID>` |
| Delete | `walrus delete --blob-id <ID>` |
| Burn | `walrus burn-blobs --object-ids <ID>` |
| Share | `walrus share --blob-obj-id <ID>` |
| Set attr | `walrus set-blob-attribute <ID> --attr "k" "v"` |
| Get attr | `walrus get-blob-attribute <ID>` |
