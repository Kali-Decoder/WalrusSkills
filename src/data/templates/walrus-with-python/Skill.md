---
name: using-walrus-with-python
description: Build, deploy, and integrate Walrus decentralized storage using Python via the Walrus HTTP API and JSON API. Use when working on blob uploads/downloads, Walrus daemon integrations, Sui object verification, Walrus event tracking, JSON-RPC requests, or Python backend services interacting with Walrus storage.
---

# Using Walrus with Python

## Scope

Use this skill for end-to-end Python integrations involving Walrus decentralized storage:
- Uploading blobs using Python `requests`
- Downloading blobs from Walrus aggregators
- Using Walrus HTTP API
- Using Walrus JSON API
- Running Walrus daemon/client locally
- Verifying Sui blob certificate objects
- Tracking Walrus storage events on-chain
- Python backend integrations and automation scripts
- Blob validation and integrity verification

---

# Repo Map

- HTTP Blob Upload API:
  - `/v1/blobs`
- HTTP Blob Download API:
  - `/v1/blobs/:blobId`
- Walrus Daemon:
  - `walrus daemon`
- Walrus JSON API:
  - `walrus json`
- Sui RPC:
  - `sui_getObject`
  - `suix_queryEvents`
- Network:
  - Walrus Testnet
  - Sui Testnet

---

# Core Rules

1. Keep network fixed to Walrus + Sui Testnet unless explicitly requested otherwise.
2. Always upload blobs using HTTP `PUT`.
3. Always read blobs using HTTP `GET`.
4. Use Python `requests` for HTTP operations.
5. Use `walrus json` mode for JSON-based command execution.
6. Support both:
   - `newlyCreated`
   - `alreadyCertified`
7. Validate uploads by downloading and verifying binary equality.
8. Preserve raw binary integrity during upload/download operations.
9. Use Sui RPC methods for certificate validation.
10. Track Walrus events using `suix_queryEvents`.

---

# Walrus Daemon Setup

## Start Local Walrus Daemon

```bash
../CONFIG/bin/walrus --config ../CONFIG/config_dir/client_config.yaml daemon \
    --bind-address 127.0.0.1:8899 \
    --sub-wallets-dir ../CONFIG/wallets \
    --n-clients 1
```

---

# HTTP API Workflow

1. Generate binary blob data
2. Upload blob using HTTP `PUT`
3. Extract `blobId`
4. Download blob using HTTP `GET`
5. Validate downloaded data
6. Verify blob integrity

---

# HTTP Upload Example

```python
import requests

ADDRESS = "127.0.0.1:8899"
EPOCHS = "5"

def upload_blob(address, epochs, data):
    store_url = f"http://{address}/v1/blobs?epochs={epochs}"

    response = requests.put(
        store_url,
        data=data
    )

    assert response.status_code == 200

    blob_id = response.json()["newlyCreated"]["blobObject"]["blobId"]

    return blob_id
```

---

# HTTP Download Example

```python
import requests

def download_blob(address, blob_id):
    read_url = f"http://{address}/v1/blobs/{blob_id}"

    response = requests.get(read_url)

    assert response.status_code == 200

    return response.content
```

---

# Full Upload + Download Validation

```python
import os
import time

ADDRESS = "127.0.0.1:8899"
EPOCHS = "5"

random_data = os.urandom(1024 * 1024)

start_time = time.time()

blob_id = upload_blob(
    ADDRESS,
    EPOCHS,
    random_data
)

upload_time = time.time()

downloaded_data = download_blob(
    ADDRESS,
    blob_id
)

assert downloaded_data == random_data

download_time = time.time()

print(f"Blob ID: {blob_id}")
print(f"Size: {len(random_data)} bytes")
print(f"Upload Time: {upload_time - start_time:.2f}s")
print(f"Download Time: {download_time - upload_time:.2f}s")
```

---

# JSON API Workflow

1. Generate temporary file
2. Execute:
   - `walrus json`
3. Submit JSON command payload
4. Parse JSON response
5. Extract:
   - `blobId`
   - `object id`
6. Download blob
7. Validate integrity
8. Query Sui certificate object

---

# JSON Store Example

```python
import json
import subprocess

store_json_command = """
{
  "config": "client_config.yaml",
  "command": {
    "store": {
      "files": ["example.bin"],
      "epochs": 2
    }
  }
}
"""

result = subprocess.run(
    ["walrus", "json"],
    text=True,
    capture_output=True,
    input=store_json_command,
)

assert result.returncode == 0

json_result = json.loads(result.stdout.strip())
```

---

# JSON Response Parsing

```python
json_result_dict = json_result[0]["blobStoreResult"]

if "newlyCreated" in json_result_dict:
    blob_id = json_result_dict["newlyCreated"]["blobObject"]["blobId"]

    sui_object_id = (
        json_result_dict["newlyCreated"]["blobObject"]["id"]
    )

elif "alreadyCertified" in json_result_dict:
    blob_id = json_result_dict["alreadyCertified"]["blobId"]

else:
    raise ValueError("Unexpected Walrus response")
```

---

# JSON Blob Read Example

```python
read_json_command = f"""
{{
  "config": "client_config.yaml",
  "command": {{
    "read": {{
      "blobId": "{blob_id}"
    }}
  }}
}}
"""

result = subprocess.run(
    ["walrus", "json"],
    text=True,
    capture_output=True,
    input=read_json_command,
)

assert result.returncode == 0
```

---

# Decode Blob Example

```python
import base64
import json

json_result_dict = json.loads(result.stdout.strip())

downloaded_data = base64.b64decode(
    json_result_dict["blob"]
)
```

---

# Sui Object Verification

## Verify Walrus Certificate Object

```python
import requests

request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sui_getObject",
    "params": [
        sui_object_id,
        {
            "showType": True,
            "showContent": True,
        },
    ],
}

response = requests.post(
    "https://fullnode.testnet.sui.io:443",
    json=request
)

object_content = response.json()["result"]["data"]["content"]

print(object_content)
```

---

# Walrus Event Tracking

## Query Walrus Events

```python
request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "suix_queryEvents",
    "params": [
        {
            "MoveModule": {
                "package": walrus_package,
                "module": "blob"
            }
        },
        None,
        100,
        True
    ],
}

response = requests.post(
    "https://fullnode.testnet.sui.io:443",
    json=request
)

events = response.json()["result"]["data"]
```

---

# Parse Event Example

```python
for event in events:
    tx_digest = event["id"]["txDigest"]

    event_type = event["type"]

    parsed_event = event["parsedJson"]

    timestamp_ms = int(event["timestampMs"])

    print(tx_digest)
    print(event_type)
    print(parsed_event)
```

---

# Supported Event Types

- `BlobRegistered`
- `BlobDeleted`
- `BlobCertified`
- `BlobExtended`

---

# Validation Checklist

- Walrus daemon starts correctly
- HTTP upload returns status `200`
- Blob downloads correctly
- Downloaded data matches uploaded data
- JSON API commands execute successfully
- Sui object verification succeeds
- Event tracking returns valid results
- Binary integrity is preserved
- Blob IDs are extracted correctly

---

# Common Fixes

## Upload Failure

- Verify daemon is running
- Verify:
  - `127.0.0.1:8899`
- Verify Walrus config path

## Blob Download Failure

- Verify blob ID exists
- Verify aggregator endpoint
- Verify HTTP `GET` path

## JSON API Failure

- Verify:
  - `walrus json`
- Verify JSON formatting
- Verify config file path

## Sui RPC Failure

- Verify Sui fullnode URL
- Verify object ID exists
- Verify network is testnet

## Binary Mismatch

- Ensure:
  - `response.content`
- Avoid accidental UTF-8 conversions

---

# Recommended Endpoints

```txt
Walrus Daemon:
http://127.0.0.1:8899

Sui Fullnode:
https://fullnode.testnet.sui.io:443
```

---

# Full Example Flow

```python
import os

random_data = os.urandom(1024 * 1024)

blob_id = upload_blob(
    "127.0.0.1:8899",
    "5",
    random_data
)

downloaded_data = download_blob(
    "127.0.0.1:8899",
    blob_id
)

assert downloaded_data == random_data

print("Blob upload and verification successful")
```

