"use client";

import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type SkillProfile } from "@/lib/skills";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import { CopyCommand } from "@/components/shared/copy-command";
import { Download, ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadSkillZip } from "@/lib/download";
import { Container } from "@/components/layout/container";

export function SkillDetailContent({ profile }: { profile: SkillProfile }) {
  const diffConfig = DIFFICULTY_CONFIG[profile.meta.difficulty] || DIFFICULTY_CONFIG.intermediate;

  async function handleDownload() {
    toast.info(`Downloading ${profile.slug}.zip...`);
    await downloadSkillZip(profile.slug, profile.skillMd, profile.readmeMd);
  }

  return (
    <div className="relative">
      <Container className="py-8 sm:py-12">
        {/* Back */}
        <Link
          href="/browse"
          className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Browse
        </Link>

        <div className="detail-layout">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              {profile.meta.name}
            </h1>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[color:var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-foreground">
                {profile.meta.category}
              </span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${diffConfig.bg} ${diffConfig.text}`}>
                {diffConfig.label}
              </span>
              <span className="rounded-md bg-white/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                v{profile.meta.version}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {profile.meta.description}
            </p>

            {/* README.md — rendered as a proper README document */}
            {profile.readmeMd && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-white/60 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 border-b border-[color:var(--brand-border)] bg-white/60 px-4 py-2.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">README.md</span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="prose-content">
                    <Markdown remarkPlugins={[remarkGfm]}>{profile.readmeMd}</Markdown>
                  </div>
                </div>
              </div>
            )}

            {/* SKILL.md — rendered as a proper file document */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-white/60 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[color:var(--brand-border)] bg-white/60 px-4 py-2.5">
                <FileText className="h-4 w-4 text-[color:var(--brand)]" />
                <span className="text-sm font-medium text-foreground">SKILL.md</span>
                <span className="ml-auto hidden text-[10px] text-muted-foreground sm:inline">Agent Instructions</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="prose-content">
                  <Markdown remarkPlugins={[remarkGfm]}>{profile.body}</Markdown>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="detail-sidebar-inner">
              {/* Download button */}
              <button
                onClick={handleDownload}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                Download Skill
              </button>

              {/* Install command */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Install
                </p>
                <CopyCommand command={`cp -r ${profile.slug}/ .claude/skills/`} />
              </div>

              {/* Metadata */}
              <div className="surface p-4">
                <dl className="space-y-3 text-sm">
                  {profile.meta.author && (
                    <div className="meta-row">
                      <dt className="text-muted-foreground">Author</dt>
                      <dd>{profile.meta.author}</dd>
                    </div>
                  )}
                  <div className="meta-row">
                    <dt>Category</dt>
                    <dd>{profile.meta.category}</dd>
                  </div>
                  <div className="meta-row">
                    <dt>Difficulty</dt>
                    <dd className={diffConfig.text}>{diffConfig.label}</dd>
                  </div>
                  <div className="meta-row">
                    <dt>Version</dt>
                    <dd>{profile.meta.version}</dd>
                  </div>
                </dl>

                {/* All tags */}
                {profile.meta.skills.length > 0 && (
                  <div className="mt-4 border-t border-[color:var(--brand-border)] pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.meta.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-[color:var(--brand-border)] bg-white/55 px-2 py-[3px] text-[11px] font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Files included */}
              <div className="surface p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Files Included
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-[color:var(--brand)]" />
                    SKILL.md
                  </div>
                  {profile.readmeMd && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 text-[color:var(--brand)]" />
                      README.md
                    </div>
                  )}
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
