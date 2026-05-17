import Link from "next/link";
import { type KnowledgeBase } from "@/lib/knowledge-bases";
import { BookOpen, ChevronRight } from "lucide-react";

export function KBCard({ kb }: { kb: KnowledgeBase }) {
  return (
    <Link
      href={`/knowledge/${kb.slug}`}
      className="group surface surface-hover flex h-full min-h-[132px] items-start gap-3.5 p-4 sm:p-5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-foreground">
        <BookOpen className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-foreground sm:text-[0.95rem]">
          {kb.meta.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-[0.85rem]">
          {kb.meta.description}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-[color:var(--brand-soft)] px-2 py-[2px] text-[10px] font-semibold text-foreground">
            {kb.meta.category}
          </span>
          {kb.meta.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground/70" />
    </Link>
  );
}
