---
name: Walrus Fundamentals
description: Understanding Walrus decentralized storage — blobs, RedStuff erasure coding, storage nodes, Sui integration, and data retrieval architecture.
category: Blockchain Fundamentals
topic: storage
author: Kali-Decoder
version: "1.0.0"
tags:
  - Walrus
  - Decentralized Storage
  - Sui
  - Blob Storage
  - RedStuff
---

# Walrus Fundamentals

Walrus is a decentralized blob storage protocol built for high-performance and reliable data availability. It is designed to store large amounts of data efficiently while using the Sui blockchain for coordination, ownership, and verification.

Unlike traditional blockchains that store all data directly onchain, Walrus stores large files offchain across distributed storage nodes while keeping metadata and verification on Sui.

## What is Stored on Walrus?

Data on Walrus is stored as **blobs**.

A blob is:

- An immutable array of bytes
- Publicly accessible by default
- Identified using a unique Blob ID
- Capable of storing any file type:
  - Images
  - Videos
  - AI datasets
  - Smart contract metadata
  - Frontend assets
  - Source code

The same content always generates the same Blob ID.

## Walrus + Sui Architecture

Walrus uses Sui as the coordination and settlement layer.

Every blob stored on Walrus is represented on Sui as a Move object called `Blob`.

Sui manages:

- Blob ownership
- Metadata
- Payments
- Storage duration
- Certifications
- System coordination

Walrus manages:

- Actual file storage
- Data distribution
- Retrieval
- Availability guarantees

## Core Components of Walrus

Walrus architecture consists of three main actors:

## 1. Users

Users interact with Walrus through:

- CLI
- JSON API
- HTTP API
- SDKs
- Publisher services

Users can:

- Upload blobs
- Read blobs
- Verify availability
- Extend storage duration

## 2. Storage Nodes

Storage nodes are responsible for storing blob data.

Instead of storing complete copies of files, Walrus uses erasure coding to split blobs into smaller pieces called **slivers**.

Key concepts:

- Each node stores specific shards
- Slivers are distributed across the network
- Nodes serve slivers during retrieval
- Network remains resilient even if some nodes fail

This design improves:

- Scalability
- Fault tolerance
- Storage efficiency

## 3. Sui Blockchain Coordination

Sui acts as the orchestration layer for Walrus.

It stores:

- Blob metadata
- Availability certificates
- Storage commitments
- Ownership records

This creates a verifiable and decentralized storage system.

## RedStuff Erasure Coding

Walrus uses a custom erasure coding system called **RedStuff**.

Instead of storing full replicas of data:

- Files are split into slivers
- Slivers are distributed across many nodes
- Only a subset of slivers is required to reconstruct the file

Benefits:

- Lower storage overhead
- High fault tolerance
- Efficient recovery
- Better scalability than simple replication

Walrus can reconstruct data even if many storage nodes are offline.

## Blob Upload Process

When uploading data to Walrus:

### Step 1 — Upload Request

The user uploads data through:

- Walrus CLI
- HTTP API
- Publisher service
- SDK

### Step 2 — Blob Encoding

Walrus runs the RedStuff encoding algorithm:

- File → split into slivers
- Slivers distributed across shards
- Blob ID generated

### Step 3 — Storage Across Nodes

Storage nodes receive and store slivers for their assigned shards.

### Step 4 — Availability Certification

Once enough storage nodes confirm storage:

- Receipt signatures are aggregated
- An availability certificate is generated
- Blob becomes certified

Certified blobs are guaranteed to remain available for the purchased storage duration.

## Blob Retrieval Process

Retrieving data from Walrus works differently from traditional cloud storage.

### Step 1 — Fetch Metadata

Client fetches blob metadata from:

- Sui
- Storage nodes
- Aggregators

### Step 2 — Request Slivers

Client requests slivers from multiple storage nodes.

### Step 3 — Verify Integrity

Each sliver is verified using authenticated signatures.

### Step 4 — Reconstruct Data

Once enough valid slivers are collected:

- RedStuff decoding reconstructs the original blob

### Step 5 — Final Verification

Hashes are verified to ensure reconstructed data matches the original blob.

If verification succeeds:

- Blob data is returned to the user

## Why Walrus is Important

Walrus is optimized for modern decentralized applications that require scalable and reliable storage.

It enables:

- Decentralized websites
- AI data storage
- Onchain media applications
- NFT metadata hosting
- Long-term archival storage
- Autonomous agent memory
- Large Web3 datasets

## What Makes Walrus Different?

### Efficient Storage

Walrus uses erasure coding instead of heavy replication.

### Verifiable Data

All data integrity is cryptographically verified.

### Blockchain Coordination

Sui provides ownership and programmable storage logic.

### High Availability

Data remains retrievable even during node failures.

### Large File Support

Walrus supports blobs up to approximately 13.6 GiB.

## Walrus Sites

Walrus also supports decentralized website hosting called **Walrus Sites**.

In Walrus Sites:

- Frontend files are stored as blobs
- Sui stores resource mappings
- Portals serve websites over HTTP

This allows fully decentralized static websites without traditional servers.

## Important Notes for Developers

- All Walrus blobs are public by default
- Sensitive data should be encrypted before upload
- Storage duration is purchased using storage resources
- Blob data is immutable after upload
- Blob ownership and metadata are programmable through Sui Move contracts

## Developer Tooling

Walrus provides:

- CLI tools
- HTTP APIs
- JSON APIs
- TypeScript SDK
- Upload relays
- Aggregators
- Publishers

This makes integration simple for Web2 and Web3 applications.

## What This Means for Builders

With Walrus, developers can build applications that combine:

- Decentralized storage
- Verifiable availability
- Onchain ownership
- Efficient large-file handling
- Permanent or long-duration storage

Walrus acts as the storage layer for the next generation of decentralized internet applications.