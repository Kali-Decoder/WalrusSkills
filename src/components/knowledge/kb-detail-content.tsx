"use client";

import { useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type KnowledgeBase } from "@/lib/knowledge-bases";
import { CopyCommand } from "@/components/shared/copy-command";
import { ChevronLeft, Download, Link2, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";

export function KBDetailContent({ kb }: { kb: KnowledgeBase }) {
  const [urlCopied, setUrlCopied] = useState(false);

  const rawUrl = typeof window !== "undefined"
    ? `${window.location.origin}/knowledge/${kb.slug}/raw`
    : `/knowledge/${kb.slug}/raw`;

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(rawUrl);
    setUrlCopied(true);
    toast.success("Agent URL copied to clipboard");
    setTimeout(() => setUrlCopied(false), 2000);
  }

  function handleDownload() {
    toast.info(`Downloading ${kb.slug}-KB.md...`);
    const blob = new Blob([kb.kbMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kb.slug}-KB.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      <Container className="py-8 sm:py-12">
        {/* Back */}
        <Link
          href="/knowledge"
          className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Knowledge Base
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="rounded-md bg-[color:var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-foreground">
                {kb.meta.category}
              </span>
              <span className="rounded-md bg-white/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                v{kb.meta.version}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              {kb.meta.name}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {kb.meta.description}
            </p>

            {/* KB.md — rendered as a file document */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-white/60 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[color:var(--brand-border)] bg-white/60 px-4 py-2.5">
                <BookOpen className="h-4 w-4 text-[color:var(--brand)]" />
                <span className="text-sm font-medium text-foreground">KB.md</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="prose prose-sm prose-gray max-w-none overflow-hidden prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-[color:var(--brand-soft)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:bg-white/70 prose-pre:border prose-pre:border-[color:var(--brand-border)] prose-th:text-foreground prose-td:text-muted-foreground">
                  <Markdown remarkPlugins={[remarkGfm]}>{kb.body}</Markdown>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-72">
            <div className="sticky top-[calc(var(--header-height)+1.5rem)] space-y-4">
              {/* Agent URL — primary action */}
              <div className="surface p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                  Agent Fetch URL
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Point your AI agent to this URL to give it this knowledge instantly.
                </p>
                <button
                  onClick={handleCopyUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  {urlCopied ? (
                    <><Check className="h-4 w-4" /> Copied</>
                  ) : (
                    <><Link2 className="h-4 w-4" /> Copy Agent URL</>
                  )}
                </button>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[color:var(--brand-border)] bg-white/60 text-sm font-semibold text-foreground/80 transition-all hover:bg-white/75 hover:text-foreground"
              >
                <Download className="h-4 w-4" />
                Download KB.md
              </button>

              {/* Install command */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Add to project
                </p>
                <CopyCommand command={`curl -o ${kb.slug}.md ${rawUrl}`} />
              </div>

              {/* Metadata */}
              <div className="surface p-4">
                <dl className="space-y-3 text-sm">
                  {kb.meta.author && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Author</dt>
                      <dd className="font-medium text-foreground">{kb.meta.author}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium text-foreground">{kb.meta.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Version</dt>
                    <dd className="font-medium text-foreground">{kb.meta.version}</dd>
                  </div>
                </dl>

                {kb.meta.tags.length > 0 && (
                  <div className="mt-4 border-t border-[color:var(--brand-border)] pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {kb.meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/60 px-2 py-[3px] text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Files */}
              <div className="surface p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  File
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-[color:var(--brand)]" />
                  KB.md
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </Container>
    </div>
  );
}
