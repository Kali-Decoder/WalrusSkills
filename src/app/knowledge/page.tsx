"use client";

import { Suspense, useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { type KnowledgeBase } from "@/lib/knowledge-bases";
import { KB_CATEGORIES } from "@/lib/kb-constants";
import { KBCard } from "@/components/knowledge/kb-card";
import { fuzzyScore } from "@/lib/search";
import { Search, X, BookOpen, Code2, Wallet, Server } from "lucide-react";
import { Container, ScrollBleed } from "@/components/layout/container";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Blockchain Fundamentals": BookOpen,
  "Smart Contracts": Code2,
  "Wallet & Frontend": Wallet,
  "Deployment & Infra": Server,
};

export default function KnowledgePage() {
  return (
    <Suspense>
      <KnowledgeContent />
    </Suspense>
  );
}

function KnowledgeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const searchRef = useRef<HTMLInputElement>(null);

  function updateURL(q: string, category: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "All") params.set("category", category);
    const qs = params.toString();
    router.replace(qs ? `/knowledge?${qs}` : "/knowledge", { scroll: false });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    fetch("/api/knowledge-bases")
      .then((r) => r.json())
      .then(setKbs)
      .finally(() => setLoading(false));
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    kbs.forEach((kb) => {
      counts[kb.meta.category] = (counts[kb.meta.category] || 0) + 1;
    });
    return counts;
  }, [kbs]);

  const filtered = useMemo(() => {
    return kbs.filter((kb) => {
      const matchCategory = activeCategory === "All" || kb.meta.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        fuzzyScore(q, kb.meta.name) > 0 ||
        fuzzyScore(q, kb.meta.description) > 0 ||
        kb.meta.tags.some((t) => fuzzyScore(q, t) > 0);
      return matchCategory && matchSearch;
    });
  }, [kbs, search, activeCategory]);

  return (
    <div className="relative">
      <Container className="py-10 sm:py-16">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
          Knowledge Base
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Chain-agnostic guides and references. Read on the site or let your AI agent fetch them via URL.
        </p>

        {/* Search */}
        <div className="mt-6 relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); updateURL(e.target.value, activeCategory); }}
            placeholder="Search guides..."
            className="h-9 w-full rounded-lg border border-[color:var(--brand-border)] bg-white/70 pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none backdrop-blur transition-all focus:bg-white focus:border-[color:var(--brand-border)] focus:ring-2 focus:ring-[color:var(--brand-soft)]"
          />
          {!search && (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[color:var(--brand-border)] bg-[color:var(--brand-soft)] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              /
            </kbd>
          )}
          {search && (
            <button
              onClick={() => { setSearch(""); updateURL("", activeCategory); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Featured topics — large category cards */}
        {!search && activeCategory === "All" && (
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {KB_CATEGORIES.filter((c) => c !== "All").map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || BookOpen;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); updateURL(search, cat); }}
                  className="surface surface-hover flex items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cat}</p>
                    <p className="text-[11px] text-muted-foreground">{count} {count === 1 ? "guide" : "guides"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Category tabs (when filtering or searching) */}
        {(search || activeCategory !== "All") && (
          <ScrollBleed className="mt-6 flex gap-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {KB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); updateURL(search, cat); }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all sm:text-xs ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/60 text-muted-foreground hover:bg-[color:var(--brand-soft)] hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollBleed>
        )}

        {/* Results count */}
        {!loading && (
          <p className="mt-6 text-xs text-muted-foreground sm:mt-8 sm:text-sm">
            {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
            {activeCategory !== "All" && (
              <span> in <span className="font-medium text-foreground">{activeCategory}</span></span>
            )}
          </p>
        )}

        {/* Article list */}
        <div className="mt-4 grid items-stretch gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="surface flex h-full items-start gap-3.5 p-4 sm:p-5">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-[color:var(--brand-soft)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-black/5" />
                    <div className="h-3 w-full animate-pulse rounded bg-black/5" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-black/5" />
                  </div>
                </div>
              ))
            : filtered.map((kb) => <KBCard key={kb.slug} kb={kb} />)}
        </div>

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="mt-10 flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--brand-soft)] text-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No guides found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search or category.</p>
            {(search || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); updateURL("", "All"); }}
                className="mt-4 inline-flex h-8 items-center rounded-full bg-[color:var(--brand-soft)] px-4 text-xs font-semibold text-foreground transition-all hover:bg-[color:color-mix(in_oklab,var(--brand-soft),white_10%)]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="h-10" />
      </Container>
    </div>
  );
}
