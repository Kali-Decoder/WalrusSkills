"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { Container } from "@/components/layout/container";

const SECTIONS = [
  { id: "marketplace", label: "Marketplace", shortLabel: "Market" },
  { id: "skills", label: "Skills", shortLabel: "Skills" },
  { id: "templates", label: "Templates", shortLabel: "Templates" },
  { id: "knowledge", label: "Knowledge Base", shortLabel: "Knowledge" },
  { id: "contribute", label: "Contribute", shortLabel: "Contribute" },
];

export default function TutorialPage() {
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState("marketplace");

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 300);

      // If scrolled to bottom, activate last section
      const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;
      if (atBottom) {
        setActive(SECTIONS[SECTIONS.length - 1].id);
        return;
      }

      for (const s of [...SECTIONS].reverse()) {
        const target = document.getElementById(s.id);
        if (target && target.getBoundingClientRect().top <= 140) {
          setActive(s.id);
          break;
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative pt-3 sm:pt-6">
      <div className="sticky top-[calc(var(--header-height)+0.75rem)] z-20 border-b border-[color:var(--brand-border)] bg-white/70 backdrop-blur-md sm:top-[calc(var(--header-height)+1.5rem)]">
        <Container className="flex items-center gap-2 py-2.5 sm:gap-0 sm:py-3.5">
          <Link
            href="/browse"
            className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground sm:mr-3 sm:px-0 sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="sr-only sm:not-sr-only sm:inline">Back</span>
          </Link>
          <div className="hidden h-4 w-px shrink-0 bg-[color:var(--brand-border)] sm:block" />
          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-thin">
            <div className="flex w-max min-w-full gap-1 pl-1 sm:gap-2 sm:pl-4">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all sm:px-4 sm:text-xs ${
                  active === s.id
                    ? "bg-[color:var(--brand-soft)] text-foreground"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                }`}
              >
                <span className="sm:hidden">{s.shortLabel}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </a>
            ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="safe-bottom pb-10 sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <article className="py-6 sm:py-14">
            <header className="space-y-3 sm:space-y-4">
              <h1 className="text-balance text-xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                Walrus Skills Marketplace Guide
              </h1>

              <p className="max-w-2xl text-sm leading-[1.75] text-muted-foreground sm:text-base">
                Learn how to use the marketplace to install <strong className="text-foreground">skills</strong>, start from{" "}
                <strong className="text-foreground">templates</strong>, and share <strong className="text-foreground">knowledge</strong> with your agent.
              </p>
            </header>

            <div className="mt-10 h-px bg-[color:var(--brand-border)]/70 sm:mt-12" />

            <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-16">
            <section id="marketplace" className="scroll-mt-[calc(var(--header-height)+4.5rem)] sm:scroll-mt-[calc(var(--header-height)+5rem)]">
              <SectionHeader title="How the marketplace works" />
              <div className="mt-5 space-y-5 sm:mt-6">
                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  Walrus Skills Marketplace is file-based: skills, templates, and guides are packaged as folders/markdown that you can download and
                  drop into your repo. The goal is to make agent onboarding fast and repeatable.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Skills", body: "Agent-ready folders with SKILL.md (+ optional README.md)." },
                    { title: "Templates", body: "Production-style starter patterns you can build on." },
                    { title: "Knowledge Base", body: "Guides with URLs your agent can fetch on demand." },
                    { title: "Collections", body: "Curated bundles to quickly install a set of skills." },
                  ].map((c) => (
                    <div key={c.title} className="surface p-4 sm:p-5">
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{c.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="skills" className="scroll-mt-[calc(var(--header-height)+4.5rem)] sm:scroll-mt-[calc(var(--header-height)+5rem)]">
              <SectionHeader title="Install a skill" />
              <div className="mt-5 space-y-5 sm:mt-6">
                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  Open a skill, review the preview, then download it and place the folder into your agent skills directory.
                </p>

                <CodeBlock>{`# 1) Download a skill from /browse
# 2) Copy the folder into your project
cp -r <skill-slug>/ .claude/skills/`}</CodeBlock>

                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  A skill is a folder that includes at minimum <Code>SKILL.md</Code> (agent instructions + metadata). Many also include{" "}
                  <Code>README.md</Code> for humans.
                </p>

                <CodeBlock>{`<skill-slug>/
├── SKILL.md
└── README.md (optional)`}</CodeBlock>
              </div>
            </section>

            <section id="templates" className="scroll-mt-[calc(var(--header-height)+4.5rem)] sm:scroll-mt-[calc(var(--header-height)+5rem)]">
              <SectionHeader title="Start from a template" />
              <div className="mt-5 space-y-5 sm:mt-6">
                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  Templates are “starter app” skills. Use them when you want a ready-to-extend baseline for a Walrus/Sui app.
                </p>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground sm:text-[0.95rem]">
                    Recommended flow:
                  </p>
                  <ol className="space-y-3 text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                    {[
                      "Pick a template from /templates",
                      "Download it and drop it into .claude/skills/",
                      "Ask your agent to adapt it to your project needs (UI, contract integration, storage flows).",
                    ].map((t) => (
                      <li key={t} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-border)]" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <section id="knowledge" className="scroll-mt-[calc(var(--header-height)+4.5rem)] sm:scroll-mt-[calc(var(--header-height)+5rem)]">
              <SectionHeader title="Use Knowledge Base with your agent" />
              <div className="mt-5 space-y-5 sm:mt-6">
                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  Each Knowledge Base page provides an <strong className="text-foreground">Agent Fetch URL</strong>. Copy it and share it with your agent so it can
                  pull the guide on demand.
                </p>
                <CodeBlock>{`# Example: add a guide into your repo as markdown
curl -o walrus-guide.md https://<your-domain>/knowledge/<slug>/raw`}</CodeBlock>
              </div>
            </section>

            <section id="contribute" className="scroll-mt-[calc(var(--header-height)+4.5rem)] sm:scroll-mt-[calc(var(--header-height)+5rem)]">
              <SectionHeader title="Contribute new skills" />
              <div className="mt-5 space-y-5 sm:mt-6">
                <p className="text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  Marketplace content is stored under <Code>src/data/</Code>. Add a folder and it shows up in the UI.
                </p>

                <CodeBlock>{`src/data/
├── skills/<skill-slug>/
├── templates/<template-slug>/
└── knowledge-bases/<kb-slug>/`}</CodeBlock>

                <ul className="space-y-3 text-sm leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
                  {[
                    <>Use clear, specific <Code>description</Code> so agents load the right skill.</>,
                    <>Keep instructions short; put long docs in <Code>references/</Code> when needed.</>,
                    <>Prefer consistent naming: lowercase with hyphens (<Code>walrus-storage-uploader</Code>).</>,
                    <>Test locally by running <Code>npm run dev</Code> and checking <Code>/browse</Code>.</>,
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-border)]" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            </div>
          </article>
        </div>
      </Container>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="safe-fixed-bottom fixed right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/70 text-muted-foreground shadow-lg backdrop-blur transition-all hover:text-foreground sm:right-6"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="flex items-start gap-2.5 text-base font-semibold leading-snug text-foreground sm:items-center sm:gap-3 sm:text-lg">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[11px] font-bold text-foreground">
        →
      </span>
      <span className="min-w-0 flex-1">{title}</span>
    </h2>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="-mx-1 overflow-x-auto rounded-xl border border-[color:var(--brand-border)] bg-white/60 p-3 font-mono text-[11px] leading-[1.65] text-muted-foreground backdrop-blur sm:mx-0 sm:p-5 sm:text-[0.85rem] sm:leading-[1.7]">
      <code>{children}</code>
    </pre>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[color:var(--brand-soft)] px-1.5 py-0.5 text-xs font-semibold text-foreground">
      {children}
    </code>
  );
}
