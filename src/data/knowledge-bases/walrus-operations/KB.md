---
name: Walrus Operations
description: Complete guide to Walrus blob operations including upload, read, download, certification, deletion, storage extension, and decentralized availability guarantees.
category: Blockchain Fundamentals
topic: operations
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Blob Storage
  - Operations
  - Sui
  - Storage Nodes
  - Decentralized Storage
---

# Walrus Operations

Walrus is a decentralized blob storage protocol designed for scalable, fault-tolerant, and verifiable storage.

Walrus combines:

- Distributed storage nodes
- Erasure coding
- Availability certification
- Sui blockchain coordination

This skill explains the complete operational lifecycle of blobs inside Walrus.

---

# What is a Blob?

A blob is a single immutable binary object stored on Walrus.

A blob can contain:

- Images
- Videos
- AI datasets
- Frontend assets
- Documents
- Smart contract metadata
- Static websites

Each blob is identified using a unique cryptographic identifier called a **Blob ID**.

Properties of Blob IDs:

- Deterministic
- Content-addressed
- Generated from encoded blob data
- Represented as a `u256`

Same file always generates the same Blob ID.

---

# Blob Storage Model

Walrus does not store entire files on every node.

Instead:

- Files are erasure encoded
- Split into slivers
- Distributed across shards
- Stored across many storage nodes

This improves:

- Scalability
- Fault tolerance
- Storage efficiency

---

# Uploading a Blob

Store a blob using:

```bash
walrus store file.txt --epochs 2 --context testnet
```

This stores the file for 2 Walrus epochs.

> Warning: All Walrus blobs are public by default. Encrypt sensitive data before uploading.

---

# Upload Operation Flow

Blob uploads involve multiple distributed operations.

---

## Step 1 — Acquire Storage Resources

Before upload:

- The client acquires storage resources onchain
- Storage resources define:
  - Blob size
  - Storage duration
  - Ownership rights

Storage resources can be:

- Split
- Merged
- Transferred

---

## Step 2 — Apply Erasure Coding

Walrus encodes the blob into distributed slivers.

Process:

- File split into encoded pieces
- Slivers assigned across shards
- Blob ID generated from encoded data

Benefits:

- Lower redundancy costs
- Efficient recovery
- Distributed resilience

---

## Step 3 — Register Blob Metadata on Sui

Walrus registers blob metadata on Sui.

Sui stores:

- Blob metadata
- Ownership
- Availability status
- Expiry information
- Certification state

Important:

- Blob contents never go onchain
- Only metadata is stored on Sui

---

## Step 4 — Distribute Slivers to Storage Nodes

Slivers are distributed across storage nodes.

Each storage node:

- Receives assigned slivers
- Verifies Blob ID integrity
- Confirms storage authorization

Each node manages specific shards.

---

## Step 5 — Generate Availability Signatures

Storage nodes sign proofs confirming:

- Sliver receipt
- Data integrity
- Successful storage

These signatures are aggregated into a:

# Certificate of Availability

---

## Step 6 — Point of Availability (PoA)

The availability certificate is submitted to Sui.

After confirmation:

- Blob reaches Point of Availability
- Blob becomes guaranteed retrievable
- Storage nodes synchronize missing data automatically

PoA is the point where Walrus guarantees blob availability.

---

# Availability Guarantees

Walrus provides strong decentralized storage guarantees.

---

## Read Completion

After PoA:

- Reads always terminate
- Users receive:
  - Blob contents
  - Or `None`

---

## Read Consistency

All correct users receive the same blob contents.

No conflicting reads occur.

---

## Correct Retrieval

Correctly stored blobs remain retrievable during the availability period.

---

# Maximum Blob Size

Current maximum blob size:

- Approximately **13.3 GiB**

Larger files should be chunked into multiple blobs.

Mainnet epoch duration:

- 2 weeks per epoch

---

# Reading a Blob

Read blob contents:

```bash
walrus read <blob-id> --context testnet
```

This reconstructs the blob and prints contents to output.

---

# Blob Read Flow

Walrus reconstructs data using distributed slivers.

---

## Step 1 — Fetch Metadata

The Blob ID is used to:

- Locate metadata
- Authenticate blob information
- Verify integrity

---

## Step 2 — Locate Storage Nodes

Sui determines:

- Which nodes hold slivers
- Shard assignments

---

## Step 3 — Request Slivers

Requests are sent to multiple storage nodes in parallel.

Walrus only requires a subset of slivers for reconstruction.

Reads succeed even during node failures.

---

## Step 4 — Reconstruct Blob

The client:

- Verifies slivers
- Reconstructs original data
- Validates integrity

Invalid slivers are rejected.

---

## Step 5 — Cache Results

Aggregators and caches may store reconstructed blobs.

Benefits:

- Faster reads
- Lower latency
- Reduced reconstruction cost

---

# Downloading a Blob

Download and save locally:

```bash
walrus read <blob-id> --out file.txt --context testnet
```

This reconstructs the blob and writes it to disk.

---

# Availability Certification

Walrus allows cryptographic verification of blob availability.

A blob can be verified using:

---

## 1. Certified Blob Event

Verify the certified blob event emitted on Sui.

---

## 2. Blob Object Verification

Verify the Sui Blob object:

- Certified
- Not expired
- Not deletable

---

## 3. Smart Contract Verification

Move smart contracts can verify blob certification directly onchain.

This enables programmable storage verification.

---

# Deleting a Blob

Delete a blob using:

```bash
walrus delete --blob-id <blob-id> --context testnet
```

Only deletable blobs can be removed.

Deleting:

- Reclaims storage resources
- Removes recoverability if all copies disappear

Important:

- Other blob copies may still exist
- Blob remains available until:
  - All copies expire
  - All copies are deleted

---

# Blob ID Utilities

Generate a Blob ID locally:

```bash
walrus blob-id <FILE>
```

Convert decimal Blob ID:

```bash
walrus convert-blob-id <BLOB_ID_DECIMAL>
```

List owned blobs:

```bash
walrus list-blobs
```

Include expired blobs:

```bash
walrus list-blobs --include-expired
```

---

# Burning Blob Objects

Blob objects on Sui can be burned to reclaim Sui storage costs.

Important:

- Burning removes ownership object
- Blob data itself is NOT deleted

Burn specific objects:

```bash
walrus burn-blobs --object-ids <SUI_OBJ_IDS>
```

Burn all objects:

```bash
walrus burn-blobs --all
```

Burn expired objects:

```bash
walrus burn-blobs --all-expired
```

---

# Extending Blob Storage Duration

Extend storage duration without re-uploading data:

```bash
walrus extend --blob-obj-id <blob-object-id> --epochs-extended 3 --context testnet
```

Important:

- Uses Blob Object ID
- Not Blob ID

Storage nodes automatically extend sliver retention.

---

# Managing Blob Attributes

Walrus supports custom metadata attributes.

Set attributes:

```bash
walrus set-blob-attribute <blob-object-id> \
  --attr "key1" "value1" \
  --attr "key2" "value2"
```

Retrieve attributes:

```bash
walrus get-blob-attribute <blob-object-id>
```

Remove attributes:

```bash
walrus remove-blob-attribute-fields <blob-object-id> --keys "key1,key2"
```

Important:

- Attributes belong to Sui objects
- Not directly to blob contents

Different objects can reference the same blob with different metadata.

---

# Inconsistency Handling

Walrus detects incorrectly encoded blobs.

If reconstruction fails:

- Storage nodes generate inconsistency proofs
- Proofs are verified network-wide
- Inconsistency certificates are submitted onchain

After inconsistency confirmation:

- Blob resolves to `None`
- Slivers are deleted
- Storage attestations stop

---

# Reading Inconsistent Blobs

Inconsistent blobs always return:

```txt
None
```

This prevents corrupted or malicious data from being served.

---

# Storage Attestation Challenges

Walrus continuously verifies that storage nodes genuinely store data.

Challenge mechanism:

- Nodes request shard proofs
- Sequential reads are validated
- Responses are authenticated
- Results are reported onchain

This prevents dishonest storage providers from claiming rewards without storing shard data.

---

# Core Walrus Components

## Sui Handles

- Metadata
- Ownership
- Certification
- Coordination
- Expiry tracking

---

## Storage Nodes Handle

- Sliver storage
- Reconstruction
- Availability
- Synchronization
- Storage attestations

---

## Aggregators Handle

- Blob reconstruction
- HTTP reads
- Caching
- Fast retrieval

---

# Key Concepts

| Concept | Meaning |
|---|---|
| Blob | Immutable file stored on Walrus |
| Blob ID | Cryptographic identifier |
| Sliver | Encoded shard piece |
| Shard | Distributed storage partition |
| PoA | Point of Availability |
| Certificate of Availability | Proof of safe distributed storage |
| Storage Node | Distributed storage provider |
| Aggregator | Blob reconstruction service |

---

# Why Walrus Operations Matter

Walrus enables:

- Decentralized storage
- Large file handling
- Fault-tolerant retrieval
- Cryptographic availability proofs
- Scalable blob distribution

Walrus is ideal for:

- AI infrastructure
- NFT metadata
- Decentralized websites
- DeFi protocols
- Autonomous agents
- Permanent archival systems

---

# Final Takeaways

Walrus combines:

- Sui blockchain coordination
- Distributed blob storage
- Erasure coding
- Availability certification
- Storage attestation
- Fault-tolerant reconstruction

The result is scalable and verifiable decentralized storage for next-generation internet applications.