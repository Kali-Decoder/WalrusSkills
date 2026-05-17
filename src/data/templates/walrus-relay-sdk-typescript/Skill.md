---
name: walrus-relay-typescript-template
description: Build, deploy, and integrate Walrus Upload Relay applications using the Walrus TypeScript SDK, React, Vite, and Sui dApp Kit. Use when working on Walrus relay uploads, browser-compatible blob uploads, React upload UIs, Sui network configs, session upload management, or Walrus SDK frontend integrations.
---

# Walrus Relay TypeScript Template

## Scope

Use this skill for end-to-end Walrus Upload Relay frontend applications:
- React + TypeScript Walrus apps
- Walrus Upload Relay integrations
- Browser-compatible blob uploads
- Sui dApp Kit integrations
- Walrus SDK frontend implementations
- Blob upload session management
- Upload UI/UX flows
- File upload React components
- Upload preview cards
- Walrus relay configuration
- Sui Testnet/Mainnet network management

---

# Stack

- React
- TypeScript
- Vite
- TailwindCSS
- Walrus TypeScript SDK
- Sui dApp Kit
- Sui Client SDK
- Walrus Upload Relay
- DotLottie animations

---

# Repo Map

- Walrus client config:
  - `src/lib/walrus.ts`
- Network config:
  - `src/networkConfig.ts`
- Main app:
  - `src/App.tsx`
- Upload component:
  - `src/components/FileUpload.tsx`
- Blob preview component:
  - `src/components/ImageCard.tsx`

---

# Core Rules

1. Keep network fixed to Walrus + Sui Testnet unless explicitly requested otherwise.
2. Always use Walrus Upload Relay for browser uploads.
3. Use `WalrusClient` from `@mysten/walrus`.
4. Configure upload relay timeout for large uploads.
5. Keep uploaded blobs in local React session state.
6. Use React hooks for upload state management.
7. Display uploaded blob previews immediately after upload.
8. Keep uploads scrollable with session-only persistence.
9. Use `createNetworkConfig` from Sui dApp Kit.
10. Use Tailwind utility classes for layout and styling.

---

# Install Dependencies

```bash
pnpm install
```

---

# Required Packages

```bash
pnpm add @mysten/walrus
pnpm add @mysten/sui
pnpm add @mysten/dapp-kit
pnpm add @lottiefiles/dotlottie-react
```

---

# Walrus Client Setup

## `src/lib/walrus.ts`

```ts
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { WalrusClient } from "@mysten/walrus";

export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

export const walrusClient = new WalrusClient({
  network: "testnet",

  suiClient,

  uploadRelay: {
    timeout: 600_000,

    host: "https://upload-relay.testnet.walrus.space",

    sendTip: {
      max: 1_000,
    },
  },
});
```

---

# Network Configuration

## `src/networkConfig.ts`

```ts
import { getFullnodeUrl } from "@mysten/sui/client";

import { createNetworkConfig } from "@mysten/dapp-kit";

const {
  networkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
  },

  mainnet: {
    url: getFullnodeUrl("mainnet"),
  },
});

export {
  useNetworkVariable,
  useNetworkVariables,
  networkConfig,
};
```

---

# Main App Structure

## `src/App.tsx`

```tsx
import { useState } from "react";

import ImageCard, {
  ImageCardProps,
  PlaceholderCard,
} from "./components/ImageCard";

import FileUpload from "./components/FileUpload";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const [uploadedBlobs, setUploadedBlobs] =
    useState<ImageCardProps[]>([]);

  const handleUploadComplete = (
    uploadedBlob: ImageCardProps
  ) => {
    setUploadedBlobs((prev) => [
      uploadedBlob,
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-16 gap-4 h-full min-h-[900px] font-montreal">
      <main className="flex flex-col items-center gap-4 mt-16 mb-8">
        <h1 className="text-7xl font-mondwest">
          Upload Blob
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-[1200px]">
          <section className="w-full max-w-[550px]">
            <FileUpload
              onUploadComplete={handleUploadComplete}
            />
          </section>

          <section className="w-full max-w-[550px]">
            <h2>
              Uploads
              <span className="opacity-50">
                {uploadedBlobs.length}
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              {uploadedBlobs.length > 0 ? (
                uploadedBlobs.map((blob) => {
                  return (
                    <ImageCard
                      key={blob.blobId}
                      blobId={blob.blobId}
                      suiObjectId={blob.suiObjectId}
                      endEpoch={blob.endEpoch}
                      patchId={blob.patchId}
                    />
                  );
                })
              ) : (
                <>
                  <PlaceholderCard />
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
```

---

# Upload Flow

1. Select file from browser
2. Upload blob through Walrus relay
3. Receive:
   - `blobId`
   - `suiObjectId`
   - `endEpoch`
4. Update React state
5. Render preview card
6. Keep uploads available during current session

---

# File Upload Component Rules

- Accept:
  - images
  - videos
  - PDFs
- Prevent duplicate uploads
- Show upload loading states
- Validate file size before upload
- Handle relay/network errors gracefully
- Return upload metadata back to parent component

---

# Upload State Example

```tsx
const [uploadedBlobs, setUploadedBlobs] =
  useState<ImageCardProps[]>([]);
```

---

# Upload Complete Handler

```tsx
const handleUploadComplete = (
  uploadedBlob: ImageCardProps
) => {
  setUploadedBlobs((prev) => [
    uploadedBlob,
    ...prev,
  ]);
};
```

---

# Placeholder Upload UI

```tsx
<>
  <PlaceholderCard />
</>
```

---

# Recommended Relay Configuration

```ts
uploadRelay: {
  timeout: 600_000,

  host: "https://upload-relay.testnet.walrus.space",

  sendTip: {
    max: 1_000,
  },
}
```

---

# Recommended UI Rules

- Use responsive Tailwind layouts
- Keep upload cards scrollable
- Add animated backgrounds
- Use session-only upload rendering
- Keep upload section visible at all times
- Show upload count
- Use loading placeholders before uploads

---

# Validation Checklist

- Walrus client initializes successfully
- Upload relay endpoint is reachable
- File uploads succeed in browser
- Blob previews render correctly
- React state updates correctly
- Uploaded blob list persists during session
- Upload cards render without duplication
- Network config resolves correctly
- Sui client connects to testnet

---

# Common Fixes

## Upload Relay Failure

- Verify:
  - `https://upload-relay.testnet.walrus.space`
- Verify network connectivity
- Increase relay timeout for large files

## Upload Not Rendering

- Verify blob preview component
- Verify upload callback updates state
- Verify React keys use `blobId`

## Sui Client Failure

- Verify:
  - `getFullnodeUrl("testnet")`
- Verify network configuration

## State Not Updating

- Ensure:
  - `setUploadedBlobs((prev) => [...])`
- Avoid mutating React state directly

## Browser Upload Issues

- Use Walrus Upload Relay instead of direct browser uploads
- Avoid uploading directly to validator endpoints

---

# Recommended Endpoints

```txt
Walrus Upload Relay:
https://upload-relay.testnet.walrus.space

Sui Testnet Fullnode:
https://fullnode.testnet.sui.io:443
```

---

# Example Upload Session Flow

```tsx
<FileUpload
  onUploadComplete={handleUploadComplete}
/>

<ImageCard
  blobId={blobId}
  suiObjectId={suiObjectId}
  endEpoch={endEpoch}
  patchId={patchId}
/>
```

---

# UI Recommendations

- Use:
  - TailwindCSS
  - glassmorphism
  - gradients
  - animated backgrounds
- Keep uploads vertically scrollable
- Add upload placeholders
- Add upload counters
- Support responsive mobile layouts

---

# Best Practices

- Keep uploads session-scoped
- Avoid global upload persistence unless required
- Use Walrus relay for browser compatibility
- Separate upload logic from UI components
- Keep network config centralized
- Keep Walrus client singleton reusable
- Handle relay/network failures gracefully
````
