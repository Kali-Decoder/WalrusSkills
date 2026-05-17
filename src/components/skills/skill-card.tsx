"use client";

import { useState } from "react";
import Link from "next/link";
import { type SkillProfile } from "@/lib/skills";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import { Download, FolderOpen, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { downloadSkillZip } from "@/lib/download";
import { CopyCommand } from "@/components/shared/copy-command";
import { SecurityBadge } from "@/components/skills/security-badge";

export function SkillCard({ profile }: { profile: SkillProfile }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    toast.info(`Downloading ${profile.slug}.zip...`);
    await downloadSkillZip(profile.slug, profile.skillMd, profile.readmeMd);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(profile.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const diffConfig = DIFFICULTY_CONFIG[profile.meta.difficulty] || DIFFICULTY_CONFIG.intermediate;

  return (
    <div className="group surface surface-hover flex h-full flex-col">
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title — links to detail page */}
        <Link href={`/browse/${profile.slug}`} className="flex items-center gap-3 group/link">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--brand-border)] bg-white/60 text-foreground">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground transition-colors group-hover/link:text-foreground sm:text-[0.95rem]">
              {profile.meta.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">{profile.slug}/</p>
          </div>
        </Link>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-[color:var(--brand-soft)] px-2 py-[2px] text-[10px] font-medium text-foreground">
            {profile.meta.category}
          </span>
          <span className={`rounded-md px-2 py-[2px] text-[10px] font-medium ${diffConfig.bg} ${diffConfig.text}`}>
            {diffConfig.label}
          </span>
          <SecurityBadge allowedTools={profile.meta.allowedTools} />
          {profile.meta.version && (
            <span className="rounded-md border border-[color:var(--brand-border)] bg-white/55 px-2 py-[2px] text-[10px] font-medium text-muted-foreground">
              v{profile.meta.version}
            </span>
          )}
        </div>

        {/* Description */}
        {profile.meta.description && (
          <p className="mt-3 line-clamp-2 text-[0.85rem] leading-[1.7] text-muted-foreground">
            {profile.meta.description}
          </p>
        )}

        {/* Tags */}
        <div className="mt-auto pt-3">
          {profile.meta.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.meta.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[color:var(--brand-border)] bg-white/55 px-2 py-[3px] text-[10px] font-medium text-muted-foreground sm:text-[11px]"
                >
                  {skill}
                </span>
              ))}
              {profile.meta.skills.length > 4 && (
                <span className="rounded-md border border-[color:var(--brand-border)] bg-white/55 px-2 py-[3px] text-[10px] text-muted-foreground sm:text-[11px]">
                  +{profile.meta.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center border-t border-[color:var(--brand-border)] px-4 py-2 sm:px-5">
        <div className="flex flex-1 gap-1">
          <button
            onClick={handleCopy}
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-all hover:bg-[color:var(--brand-soft)] hover:text-foreground"
            title="Copy instructions to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-all hover:bg-[color:var(--brand-soft)] hover:text-foreground"
            title="Download skill folder"
          >
            <Download className="h-3 w-3" />
            <span>Download</span>
          </button>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span>{expanded ? "Hide" : "Preview"}</span>
        </button>
      </div>

      {/* Preview panel */}
      {expanded && (
        <div className="border-t border-[color:var(--brand-border)] p-4 sm:p-5">
          <div className="max-h-80 overflow-auto rounded-xl border border-[color:var(--brand-border)] bg-white/55 p-4 backdrop-blur sm:p-5">
            <div className="prose prose-sm prose-gray max-w-none overflow-hidden prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-[color:var(--brand-soft)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:bg-white/70 prose-pre:border prose-pre:border-[color:var(--brand-border)]">
              <Markdown remarkPlugins={[remarkGfm]}>{profile.body}</Markdown>
            </div>
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">Install</p>
            <CopyCommand command={`cp -r ${profile.slug}/ your-project/.claude/skills/`} />
          </div>
        </div>
      )}
    </div>
  );
}
