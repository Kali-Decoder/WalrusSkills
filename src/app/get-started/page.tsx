"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Server,
  Compass,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";

const PATHS = [
  {
    id: "walrus-sites",
    label: "Walrus Sites",
    desc: "Deploy and host decentralized sites",
    icon: Layers,
    collection: "walrus-sites",
    skills: ["deploy-walrus-site", "walrus-site-configuration", "linking-walrus-sites-external-urls"],
  },
  {
    id: "local-portal",
    label: "Local Portal",
    desc: "Browse Testnet sites on your machine",
    icon: Server,
    collection: "walrus-starter",
    skills: ["deploy-walrus-site", "deploy-local-portal", "walrus-site-configuration"],
  },
  {
    id: "ship-app",
    label: "Ship an App",
    desc: "Full-stack UI with Walrus storage",
    icon: Rocket,
    collection: "ship-on-walrus",
    skills: ["fullstack-web3-dev", "ui-ux-designer", "deploy-walrus-site"],
  },
  {
    id: "foundations",
    label: "Walrus Foundations",
    desc: "Architecture, config, and linking",
    icon: Compass,
    collection: "walrus-architecture",
    skills: ["techincal-architecture-overview", "walrus-site-configuration", "linking-walrus-sites-external-urls"],
  },
  {
    id: "explore",
    label: "Exploring",
    desc: "Just browsing — show me everything",
    icon: Compass,
    collection: "walrus-starter",
    skills: ["deploy-walrus-site", "deploy-local-portal", "walrus-site-configuration"],
  },
];

const STEPS = [
  { num: 1, title: "Pick a path", desc: "Choose what you're building" },
  { num: 2, title: "Install skills", desc: "Add the skill folder to your repo" },
  { num: 3, title: "Start shipping", desc: "Let your agent build on Walrus + Sui" },
];

export default function GetStartedPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPath = PATHS.find((p) => p.id === selected);

  return (
    <div className="relative">
      <Container className="py-10 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Left: picker */}
          <div className="min-w-0 flex-1">
            <PageHeader
              title="Get Started"
              description="Pick what you want to build, install the skill templates, and start shipping with your agent."
            />

            {/* Steps */}
            <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.num} className="surface flex items-start gap-3 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {step.num}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground sm:text-sm">{step.title}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Path selector */}
            <div className="mt-8">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground sm:text-base">
                  What are you building?
                </h2>
                {selectedPath && (
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    type="button"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PATHS.map((path) => {
                  const Icon = path.icon;
                  const isSelected = selected === path.id;
                  return (
                    <button
                      key={path.id}
                      onClick={() => setSelected(isSelected ? null : path.id)}
                      className={`surface surface-hover group flex h-full flex-col justify-between p-4 text-left ${
                        isSelected ? "ring-1 ring-foreground/15" : ""
                      }`}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--brand-border)] ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-white/60 text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {path.label}
                          </p>
                          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                            {path.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Recommended set
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/80 transition-colors group-hover:text-foreground">
                          Select <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: preview */}
          <aside className="w-full shrink-0 lg:w-[360px]">
            <div className="detail-sidebar-inner surface p-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-foreground/80" />
                <p className="text-sm font-semibold text-foreground">Your setup</p>
              </div>

              {!selectedPath ? (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    Choose a path to see the recommended skills, install command, and next steps.
                  </p>
                  <div className="mt-4 rounded-xl border border-[color:var(--brand-border)] bg-white/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Install location
                    </p>
                    <p className="mt-2 font-mono text-xs text-foreground">
                      .claude/skills/
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/browse"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Browse all skills
                    </Link>
                    <Link
                      href="/tutorial"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/60 px-5 text-sm font-semibold text-foreground/80 transition-all hover:bg-white/75 hover:text-foreground"
                    >
                      Read the guide
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">
                    Recommended skills for <span className="font-semibold text-foreground">{selectedPath.label}</span>.
                  </p>

                  <div className="mt-4 rounded-xl border border-[color:var(--brand-border)] bg-white/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Install location
                    </p>
                    <p className="mt-2 font-mono text-xs text-foreground">
                      .claude/skills/
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Drop the downloaded skill folder here.
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {selectedPath.skills.map((slug) => (
                      <Link
                        key={slug}
                        href={`/browse/${slug}`}
                        className="surface-hover flex items-center justify-between rounded-xl border border-[color:var(--brand-border)] bg-white/60 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-foreground/80" />
                          <span className="truncate text-sm font-semibold text-foreground">{slug}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      href={
                        selectedPath.collection
                          ? `/browse?collection=${selectedPath.collection}`
                          : "/browse"
                      }
                      className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Browse these skills
                    </Link>
                    <Link
                      href="/tutorial"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/60 px-5 text-sm font-semibold text-foreground/80 transition-all hover:bg-white/75 hover:text-foreground"
                    >
                      Read the guide
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="h-10" />
      </Container>
    </div>
  );
}
