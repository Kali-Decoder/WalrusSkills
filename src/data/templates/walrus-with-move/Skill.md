---
name: walrus-with-move
description: Build and integrate Walrus onchain storage objects using the Move language on Sui. Use when working on Walrus Blob objects, Move smart contracts, Walrus package imports, wrapped blob storage patterns, object ownership, TxContext handling, or Sui Move integrations with Walrus.
---

# Walrus with Move

## Scope

Use this skill for Move-based Walrus integrations on Sui:
- Walrus Blob object integrations
- Sui Move smart contracts using Walrus
- Wrapping and storing Walrus blobs onchain
- Walrus package imports
- Object ownership and transfers
- Move module architecture
- TxContext handling
- Sui object lifecycle management
- Walrus onchain storage abstractions
- Blob wrapper contracts

---

# Stack

- Sui Move
- Walrus
- Sui Framework
- Move Package Manager
- Sui CLI

---

# Repo Map

- Move module:
  - `sources/wrapped_blob.move`
- Walrus package:
  - `walrus::blob`
- Core object:
  - `Blob`
- Wrapper object:
  - `WrappedBlob`

---

# Core Rules

1. Keep network fixed to Sui + Walrus Testnet unless explicitly requested otherwise.
2. Always import Walrus blob objects from:
   - `walrus::blob::Blob`
3. Use Sui object patterns with:
   - `UID`
   - `TxContext`
4. All wrapped storage objects must have:
   - `has key`
5. Always create new object IDs using:
   - `object::new(ctx)`
6. Preserve blob ownership inside wrapped objects.
7. Use wrapper contracts for composable onchain blob management.
8. Keep blob handling modular and reusable.
9. Prefer explicit object ownership patterns.
10. Keep Move modules minimal and composable.

---

# Install Dependencies

## Install Sui CLI

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

---

# Initialize Move Project

```bash
sui move new walrus_dep
```

---

# Move.toml Example

```toml
[package]
name = "walrus_dep"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "testnet" }

Walrus = { git = "https://github.com/MystenLabs/walrus.git", subdir = "contracts/walrus", rev = "testnet" }

[addresses]
walrus_dep = "0x0"
```

---

# Wrapped Blob Module

## `sources/wrapped_blob.move`

```move
module walrus_dep::wrapped_blob {

    use sui::object::{Self, UID};

    use sui::tx_context::{Self, TxContext};

    use walrus::blob::Blob;

    public struct WrappedBlob has key {
        id: UID,
        blob: Blob,
    }

    public fun wrap(
        blob: Blob,
        ctx: &mut TxContext
    ): WrappedBlob {
        WrappedBlob {
            id: object::new(ctx),
            blob,
        }
    }
}
```

---

# Blob Wrapper Workflow

1. Receive Walrus `Blob`
2. Create wrapper object
3. Generate new `UID`
4. Store blob inside wrapper
5. Return wrapped object
6. Transfer/store wrapper onchain

---

# Core Move Concepts

## Blob Import

```move
use walrus::blob::Blob;
```

---

## TxContext Import

```move
use sui::tx_context::{Self, TxContext};
```

---

## UID Import

```move
use sui::object::{Self, UID};
```

---

# Wrapper Object Pattern

```move
public struct WrappedBlob has key {
    id: UID,
    blob: Blob,
}
```

---

# Object Creation Pattern

```move
id: object::new(ctx)
```

---

# Wrapper Constructor Pattern

```move
public fun wrap(
    blob: Blob,
    ctx: &mut TxContext
): WrappedBlob
```

---

# Compile Contract

```bash
sui move build
```

---

# Publish Contract

```bash
sui client publish --gas-budget 100000000
```

---

# Example Transfer Pattern

```move
transfer::public_transfer(
    wrapped_blob,
    recipient
);
```

---

# Example Shared Object Pattern

```move
transfer::share_object(
    wrapped_blob
);
```

---

# Validation Checklist

- Move package compiles successfully
- Walrus dependency resolves correctly
- Blob object imports correctly
- Wrapped object has `key`
- UID generation succeeds
- TxContext passed correctly
- Wrapper object stores blob correctly
- Contract publishes successfully
- Wrapped object transferable onchain

---

# Common Fixes

## Dependency Resolution Failure

- Verify:
  - Walrus git dependency
  - Sui framework dependency
- Verify `Move.toml`

## Blob Import Failure

- Ensure:
  - `use walrus::blob::Blob;`

## UID Errors

- Ensure:
  - `use sui::object::{Self, UID};`
- Ensure:
  - `object::new(ctx)`

## TxContext Errors

- Ensure:
  - `&mut TxContext`
- Ensure:
  - `use sui::tx_context::{Self, TxContext};`

## Publish Failure

- Verify active Sui network
- Verify gas budget
- Verify testnet environment

---

# Recommended Commands

## Build

```bash
sui move build
```

## Test

```bash
sui move test
```

## Publish

```bash
sui client publish --gas-budget 100000000
```

---

# Example Full Flow

```move
module walrus_dep::wrapped_blob {

    use sui::object::{Self, UID};

    use sui::tx_context::{Self, TxContext};

    use walrus::blob::Blob;

    public struct WrappedBlob has key {
        id: UID,
        blob: Blob,
    }

    public fun wrap(
        blob: Blob,
        ctx: &mut TxContext
    ): WrappedBlob {
        WrappedBlob {
            id: object::new(ctx),
            blob,
        }
    }
}
```

---

# Best Practices

- Keep blob wrappers composable
- Use explicit ownership patterns
- Keep Move modules minimal
- Separate blob logic into reusable modules
- Prefer immutable object creation flows
- Keep TxContext handling explicit
- Use wrapper objects for advanced app integrations
- Follow standard Sui object lifecycle patterns