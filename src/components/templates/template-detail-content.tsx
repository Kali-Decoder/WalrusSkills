"use client";

import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type TemplateProfile } from "@/lib/templates";
import { DIFFICULTY_CONFIG } from "@/lib/constants";
import { CopyCommand } from "@/components/shared/copy-command";
import { Download, ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadSkillZip } from "@/lib/download";
import { Container } from "@/components/layout/container";

export function TemplateDetailContent({ profile }: { profile: TemplateProfile }) {
  const diffConfig = DIFFICULTY_CONFIG[profile.meta.difficulty] || DIFFICULTY_CONFIG.intermediate;
  const readmeContent = `# ${profile.meta.displayName}

${profile.meta.description}
`;

  async function handleDownload() {
    toast.info(`Downloading ${profile.slug}.zip...`);
    await downloadSkillZip(profile.slug, profile.skillMd, readmeContent);
  }

  return (
    <div className="relative">
      <Container className="py-8 sm:py-12">
        <Link
          href="/templates"
          className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Templates
        </Link>

        <div className="detail-layout">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              {profile.meta.displayName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[color:var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-foreground">
                {profile.meta.category}
              </span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${diffConfig.bg} ${diffConfig.text}`}>
                {diffConfig.label}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {profile.meta.description}
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--brand-border)] bg-white/60 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[color:var(--brand-border)] bg-white/60 px-4 py-2.5">
                <FileText className="h-4 w-4 text-[color:var(--brand)]" />
                <span className="text-sm font-medium text-foreground">SKILL.md</span>
                <span className="ml-auto hidden text-[10px] text-muted-foreground sm:inline">Template Instructions</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="prose-content">
                  <Markdown remarkPlugins={[remarkGfm]}>{profile.body}</Markdown>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="detail-sidebar-inner">
              <button
                onClick={handleDownload}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                Download Skill
              </button>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Install
                </p>
                <CopyCommand command={`cp -r ${profile.slug}/ .claude/skills/`} />
              </div>

              <div className="surface p-4">
                <dl className="space-y-3 text-sm">
                  <div className="meta-row">
                    <dt>Category</dt>
                    <dd>{profile.meta.category}</dd>
                  </div>
                  <div className="meta-row">
                    <dt>Difficulty</dt>
                    <dd className={diffConfig.text}>{diffConfig.label}</dd>
                  </div>
                </dl>

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

              <div className="surface p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Files Included
                </p>
                <div className="space-y-2">
                  {profile.files.map((file) => (
                    <div key={file} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 text-[color:var(--brand)]" />
                      {file}
                    </div>
                  ))}
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
