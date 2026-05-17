"use client";

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SkillCard } from "@/components/skills/skill-card";
import { type SkillProfile } from "@/lib/skills";
import { CATEGORIES } from "@/lib/constants";
import { type Collection } from "@/lib/collections";
import { CollectionCard } from "@/components/skills/collection-card";
import { Search, X } from "lucide-react";
import { fuzzyScore, bestMatch } from "@/lib/search";
import { Container } from "@/components/layout/container";

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<SkillProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get("tag") || null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const updateURL = useCallback((q: string, category: string, tag: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "All") params.set("category", category);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
  }, [router]);

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
    fetch("/api/skills")
      .then((r) => r.json())
      .then(setProfiles)
      .finally(() => setLoading(false));
    fetch("/api/collections")
      .then((r) => r.json())
      .then(setCollections)
      .catch(() => {});
  }, []);

  // Tags scoped to active category
  const allTags = useMemo(() => {
    const categoryProfiles = activeCategory === "All"
      ? profiles
      : profiles.filter((p) => p.meta.category === activeCategory);
    const s = new Set<string>();
    categoryProfiles.forEach((p) => p.meta.skills.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [profiles, activeCategory]);

  const visibleTags = showAllTags ? allTags : allTags.slice(0, 6);
  const hiddenCount = allTags.length - 6;

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (activeCollection.length > 0) {
        return activeCollection.includes(p.slug);
      }
      const matchCategory = activeCategory === "All" || p.meta.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        fuzzyScore(q, p.meta.name) > 0 ||
        fuzzyScore(q, p.meta.description) > 0 ||
        p.meta.skills.some((s) => fuzzyScore(q, s) > 0) ||
        fuzzyScore(q, p.meta.category) > 0;
      const matchTag = !activeTag || p.meta.skills.includes(activeTag);
      return matchCategory && matchSearch && matchTag;
    });
  }, [profiles, search, activeCategory, activeTag, activeCollection]);

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setActiveTag(null);
    setShowAllTags(false);
    updateURL(search, cat, null);
  }

  return (
    <div className="relative">
      <Container className="py-10 sm:py-16">
        <PageHeader
          title="Skills Marketplace"
          description="Download a skill folder, drop it in your project, and start building."
        />

        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
          New here?{" "}
          <Link
            href="/tutorial"
            className="font-medium text-foreground transition-colors hover:text-foreground"
          >
            Read the guide
          </Link>
        </p>

        {/* Toolbar: count + search */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
          {!loading && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              {filtered.length}{" "}
              {filtered.length === 1 ? "skill" : "skills"}
              {activeCategory !== "All" && (
                <span>
                  {" "}in <span className="font-medium text-foreground">{activeCategory}</span>
                </span>
              )}
            </p>
          )}

          <div className="relative w-full sm:max-w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); updateURL(e.target.value, activeCategory, activeTag); }}
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-[color:var(--brand-border)] bg-white/70 pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none backdrop-blur transition-all focus:bg-white focus:border-[color:var(--brand-border)] focus:ring-2 focus:ring-[color:var(--brand-soft)]"
            />
            {!search && (
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[color:var(--brand-border)] bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                /
              </kbd>
            )}
            {search && (
              <button
                onClick={() => { setSearch(""); updateURL("", activeCategory, activeTag); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="mt-4 flex gap-1 max-sm:overflow-x-auto max-sm:pb-2 max-sm:-mx-5 max-sm:px-5 sm:mt-5 sm:flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all sm:text-xs ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/60 text-muted-foreground hover:bg-[color:var(--brand-soft)] hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag sub-filters */}
        {allTags.length > 0 && (
          <div className="mt-3 flex gap-1.5 max-sm:overflow-x-auto max-sm:pb-2 max-sm:-mx-5 max-sm:px-5 sm:flex-wrap">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => { const next = activeTag === tag ? null : tag; setActiveTag(next); updateURL(search, activeCategory, next); }}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all sm:text-[11px] ${
                  activeTag === tag
                    ? "bg-[color:var(--brand-soft)] text-foreground"
                    : "bg-white/40 text-muted-foreground hover:bg-[color:var(--brand-soft)] hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
            {hiddenCount > 0 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="hidden shrink-0 rounded-full border border-dashed border-[color:var(--brand-border)] bg-white/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-all hover:text-foreground sm:inline-flex sm:text-[11px]"
              >
                {showAllTags ? "Show less" : `+${hiddenCount} more`}
              </button>
            )}
          </div>
        )}

        {/* Collections */}
        {collections.length > 0 && activeCollection.length === 0 && !search && activeCategory === "All" && !activeTag && (
          <div className="mt-6 sm:mt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Curated Collections
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 sm:-mx-8 sm:px-8">
              {collections.map((c) => (
                <CollectionCard
                  key={c.id}
                  collection={c}
                  onSelect={setActiveCollection}
                  active={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active collection banner */}
        {activeCollection.length > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-[color:var(--brand-border)] bg-white/60 px-4 py-3 backdrop-blur sm:mt-8">
            <p className="text-sm font-medium text-foreground">
              Showing {activeCollection.length} skills from collection
            </p>
            <button
              onClick={() => setActiveCollection([])}
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="mt-6 grid items-stretch gap-4 sm:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="surface flex h-full flex-col p-0"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-lg bg-[color:var(--brand-soft)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                        <div className="h-3 w-20 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="h-3 w-full animate-pulse rounded bg-black/5 dark:bg-white/10" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <div className="h-5 w-12 animate-pulse rounded-md bg-[color:var(--brand-soft)]" />
                      <div className="h-5 w-14 animate-pulse rounded-md bg-[color:var(--brand-soft)]" />
                      <div className="h-5 w-10 animate-pulse rounded-md bg-[color:var(--brand-soft)]" />
                    </div>
                  </div>
                  <div className="border-t border-[color:var(--brand-border)] px-4 py-2.5 sm:px-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                  </div>
                </div>
              ))
            : filtered.map((p) => <SkillCard key={p.slug} profile={p} />)}
        </div>

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="mt-10 flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--brand-soft)] text-foreground">
              <Search className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {profiles.length === 0 ? "No templates yet" : "No results found"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profiles.length === 0
                ? "Skill templates will appear here once they're added."
                : "Try a different search term or clear the filters."}
            </p>
            {search && profiles.length > 0 && (() => {
              const suggestion = bestMatch(search, profiles.map((p) => ({ name: p.meta.name, slug: p.slug })));
              return suggestion ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Did you mean{" "}
                  <button
                    onClick={() => { setSearch(suggestion); updateURL(suggestion, activeCategory, activeTag); }}
                    className="font-medium text-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                  ?
                </p>
              ) : null;
            })()}
            {(search || activeTag || activeCategory !== "All") ? (
              <button
                onClick={() => { setSearch(""); setActiveTag(null); setActiveCategory("All"); updateURL("", "All", null); }}
                className="mt-4 inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/tutorial"
                className="mt-4 inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Learn how to create one
              </Link>
            )}
          </div>
        )}

        <div className="h-10" />
      </Container>
    </div>
  );
}
