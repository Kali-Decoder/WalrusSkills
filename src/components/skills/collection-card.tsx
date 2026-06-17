"use client";

import { type Collection } from "@/lib/collections";
import { Rocket, Layers, Server, Compass } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  rocket: Rocket,
  layers: Layers,
  server: Server,
  compass: Compass,
};

export function CollectionCard({
  collection,
  onSelect,
  active,
}: {
  collection: Collection;
  onSelect: (collection: Collection) => void;
  active: boolean;
}) {
  const Icon = ICON_MAP[collection.icon] || Rocket;
  const skillCount = collection.skills.length;

  return (
    <button
      onClick={() => onSelect(collection)}
      className={`surface surface-hover flex w-[85vw] max-w-[17rem] shrink-0 flex-col gap-3 px-4 py-3.5 text-left sm:w-72 sm:max-w-none sm:px-5 sm:py-4 ${
        active ? "ring-1 ring-foreground/15" : ""
      }`}
      type="button"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--brand-border)] ${
            active ? "bg-primary text-primary-foreground" : "bg-white/60 text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {collection.name}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">
            {collection.description}
          </p>
        </div>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {skillCount} {skillCount === 1 ? "skill" : "skills"}
      </p>
    </button>
  );
}
