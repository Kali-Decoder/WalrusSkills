"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { TemplateCard } from "@/components/templates/template-card";
import { type TemplateProfile } from "@/lib/templates";
import { Container } from "@/components/layout/container";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      <Container className="py-10 sm:py-16">
        <PageHeader
          title="App Templates"
          description="Production-style template skills you can use as a base to build fully fledged apps."
        />

        {!loading && (
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            {templates.length} {templates.length === 1 ? "template" : "templates"} available
          </p>
        )}

        <div className="mt-6 grid items-stretch gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="surface flex h-full min-h-[280px] flex-col p-0">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-[color:var(--brand-soft)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 animate-pulse rounded bg-black/5" />
                        <div className="h-3 w-28 animate-pulse rounded bg-black/5" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-1.5">
                      <div className="h-5 w-16 animate-pulse rounded-md bg-[color:var(--brand-soft)]" />
                      <div className="h-5 w-20 animate-pulse rounded-md bg-[color:var(--brand-soft)]" />
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="h-3 w-full animate-pulse rounded bg-black/5" />
                      <div className="h-3 w-full animate-pulse rounded bg-black/5" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-black/5" />
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="h-3 w-12 animate-pulse rounded bg-black/5" />
                      <div className="h-3 w-32 animate-pulse rounded bg-black/5" />
                      <div className="h-3 w-28 animate-pulse rounded bg-black/5" />
                    </div>
                  </div>
                  <div className="mt-auto border-t border-[color:var(--brand-border)] px-4 py-2.5 sm:px-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-black/5" />
                  </div>
                </div>
              ))
            : templates.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
          <Link
            href="/tutorial"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Read skill guide
          </Link>
          <Link
            href="/browse"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/60 px-5 text-sm font-medium text-foreground/80 transition-all hover:bg-white/75"
          >
            Browse live skills
          </Link>
        </div>

        <div className="h-10" />
      </Container>
    </div>
  );
}
