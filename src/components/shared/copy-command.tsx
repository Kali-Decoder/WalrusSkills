"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <code className="flex-1 truncate font-mono text-xs text-gray-600">{command}</code>
      <button
        onClick={handleCopy}
        className="ml-2 shrink-0 text-gray-300 transition-colors hover:text-gray-900"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
