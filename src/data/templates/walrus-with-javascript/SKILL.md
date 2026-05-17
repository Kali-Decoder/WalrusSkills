---
name: using-walrus-with-javascript
description: Build, deploy, and integrate Walrus decentralized storage via JavaScript/TypeScript using HTTP API endpoints. Use when working on blob uploads (PUT), blob downloads (GET) via aggregators/publishers, handling Sui object responses, media-type renderings, and Web API implementations.
---

# Using Walrus with JavaScript

## Scope

Use this skill for end-to-end work involving Web UI and backend JavaScript/TypeScript integrations with Walrus storage:
- Native JavaScript `fetch` operations interacting with Walrus Publisher and Aggregator nodes.
- Parsing and handling Walrus API response shapes (`newlyCreated` vs `alreadyCertified`).
- Formatting, displaying, and handling media elements resolved from Walrus Blob IDs.
- Building frontend upload flows and backend blob integrations.
- Rendering files fetched from Walrus aggregators.

---

# Repo Map

- Upload endpoint:
  - `/v1/blobs`
- Aggregator endpoint:
  - `/v1/blobs/:blobId`
- Network:
  - Walrus Testnet
  - Sui Testnet
- Explorer:
  - `https://suiscan.xyz/testnet`
- Integration style:
  - Native browser `fetch`
  - JavaScript / TypeScript frontend apps

---

# Core Rules

1. Keep network fixed to Walrus + Sui Testnet unless user explicitly asks otherwise.
2. Always upload blobs using HTTP `PUT`.
3. Always pass `epochs` query param during uploads.
4. Always fetch blobs through Aggregator `GET /v1/blobs/:blobId`.
5. Preserve original MIME type from uploaded files (`inputFile.type`).
6. Support both:
   - `newlyCreated`
   - `alreadyCertified`
7. Prefer native browser `fetch` over third-party SDKs unless explicitly requested.
8. Use dynamic media rendering with:
   - `<object>`
   - `<img>`
   - `<video>`
9. Preserve blob metadata:
   - `blobId`
   - `endEpoch`
   - explorer references
10. Keep upload UX safe using loading states and duplicate-submit prevention.

---

# Upload Workflow

1. Accept:
   - `File`
   - `Blob`
   - raw binary data
2. Validate:
   - file exists
   - file size limit
3. Build upload URL:
   - `/v1/blobs?epochs=<epochs>`
4. Optional:
   - `send_object_to=<wallet>`
5. Upload with HTTP `PUT`
6. Parse response
7. Extract:
   - `blobId`
   - `endEpoch`
   - tx digest
   - object id
8. Build explorer links
9. Render blob preview

---

# Blob Fetch Workflow

1. Build aggregator URL:
   - `${aggregatorUrl}/v1/blobs/${blobId}`
2. Use HTTP `GET`
3. Resolve binary blob
4. Render using original MIME type
5. Support:
   - images
   - videos
   - PDFs
   - generic downloads

---

# JavaScript Upload Implementation

```javascript
async function storeBlob(
  fileInput,
  epochs,
  publisherUrl,
  optionalReceiver = ""
) {
  let url = `${publisherUrl}/v1/blobs?epochs=${epochs}`;

  if (optionalReceiver.trim()) {
    url += `&send_object_to=${optionalReceiver.trim()}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    body: fileInput,
  });

  if (!response.ok) {
    throw new Error("Failed to upload blob to Walrus.");
  }

  const data = await response.json();

  return {
    data,
    mimeType: fileInput.type,
  };
}
```

---

# Upload Form Example

```javascript
const form = document.querySelector("#upload-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.querySelector("#file").files[0];

  if (!fileInput) {
    alert("Select a file first.");
    return;
  }

  try {
    const result = await storeBlob(
      fileInput,
      5,
      "https://publisher.walrus-testnet.walrus.space"
    );

    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
```

---

# Walrus Response Formats

## Newly Created Blob

```json
{
  "newlyCreated": {
    "blobObject": {
      "blobId": "string",
      "id": "string",
      "storage": {
        "endEpoch": 0
      }
    }
  }
}
```

## Already Certified Blob

```json
{
  "alreadyCertified": {
    "blobId": "string",
    "endEpoch": 0,
    "event": {
      "txDigest": "string"
    }
  }
}
```

---

# Response Parsing Logic

```javascript
function parseWalrusResponse(storageInfo) {
  if ("alreadyCertified" in storageInfo) {
    return {
      blobId: storageInfo.alreadyCertified.blobId,
      endEpoch: storageInfo.alreadyCertified.endEpoch,
      explorer: `https://suiscan.xyz/testnet/tx/${storageInfo.alreadyCertified.event.txDigest}`,
    };
  }

  if ("newlyCreated" in storageInfo) {
    return {
      blobId: storageInfo.newlyCreated.blobObject.blobId,
      endEpoch:
        storageInfo.newlyCreated.blobObject.storage.endEpoch,
      explorer: `https://suiscan.xyz/testnet/object/${storageInfo.newlyCreated.blobObject.id}`,
    };
  }

  throw new Error("Unknown Walrus response format.");
}
```

---

# Aggregator Fetch Example

```javascript
async function fetchBlob(blobId, aggregatorUrl) {
  const response = await fetch(
    `${aggregatorUrl}/v1/blobs/${blobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch blob.");
  }

  return await response.blob();
}
```

---

# Dynamic Media Rendering

```javascript
function renderBlob(blobId, mimeType, aggregatorUrl, endEpoch) {
  const blobUrl = `${aggregatorUrl}/v1/blobs/${blobId}`;

  const isImage = mimeType.startsWith("image");
  const isVideo = mimeType.startsWith("video");
  const isPdf = mimeType === "application/pdf";

  let preview = "";

  if (isImage) {
    preview = `
      <img
        src="${blobUrl}"
        alt="Walrus Blob"
        class="preview-image"
      />
    `;
  } else if (isVideo) {
    preview = `
      <video controls>
        <source src="${blobUrl}" type="${mimeType}" />
      </video>
    `;
  } else if (isPdf) {
    preview = `
      <object
        data="${blobUrl}"
        type="${mimeType}"
        width="100%"
        height="500">
      </object>
    `;
  } else {
    preview = `
      <a href="${blobUrl}" target="_blank">
        Download Blob
      </a>
    `;
  }

  return `
    <article class="blob-card">
      ${preview}

      <div class="blob-meta">
        <p>
          <strong>Blob ID:</strong>
          ${blobId}
        </p>

        <p>
          <strong>Stored Until Epoch:</strong>
          ${endEpoch}
        </p>
      </div>
    </article>
  `;
}
```

---

# Explorer URL Helpers

```javascript
function buildTxExplorerUrl(txDigest) {
  return `https://suiscan.xyz/testnet/tx/${txDigest}`;
}

function buildObjectExplorerUrl(objectId) {
  return `https://suiscan.xyz/testnet/object/${objectId}`;
}
```

---

# Validation Checklist

- Upload requests use HTTP `PUT`
- Aggregator requests use HTTP `GET`
- File sizes stay within Walrus publisher limits
- Blob IDs resolve correctly
- Explorer URLs open correctly
- MIME types are preserved
- Duplicate uploads are prevented
- UI loading states work correctly
- Both Walrus response formats are handled
- Aggregator URLs include `https://`

---

# Common Fixes

## Upload Failing

- Verify publisher URL contains:
  - `https://`
- Verify:
  - `epochs` query parameter exists
- Verify file size is within allowed limits

## Blob Not Rendering

- Ensure original MIME type is preserved:
  - `inputFile.type`

## CORS Errors

- Use valid Walrus publisher/aggregator endpoints
- Ensure browser allows external requests

## Broken Explorer Links

- Verify:
  - tx digest extraction
  - object id extraction

## Download Instead of Preview

- Ensure renderer uses:
  - `<object>`
  - `<img>`
  - `<video>`
- Ensure correct MIME type is passed into HTML renderer

---

# Recommended Public Endpoints

```txt
Publisher:
https://publisher.walrus-testnet.walrus.space

Aggregator:
https://aggregator.walrus-testnet.walrus.space
```

---

# Example Full Flow

```javascript
async function uploadAndRender(fileInput) {
  const publisherUrl =
    "https://publisher.walrus-testnet.walrus.space";

  const aggregatorUrl =
    "https://aggregator.walrus-testnet.walrus.space";

  const uploadResult = await storeBlob(
    fileInput,
    5,
    publisherUrl
  );

  const parsed = parseWalrusResponse(uploadResult.data);

  const html = renderBlob(
    parsed.blobId,
    fileInput.type,
    aggregatorUrl,
    parsed.endEpoch
  );

  document.querySelector("#results").innerHTML = html;
}
```

