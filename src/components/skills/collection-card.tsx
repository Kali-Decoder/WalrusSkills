"use client";

import { type Collection } from "@/lib/collections";
import { Rocket, BarChart3, Gamepad2, Coins } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  rocket: Rocket,
  chart: BarChart3,
  gamepad: Gamepad2,
  coins: Coins,
};

export function CollectionCard({
  collection,
  onSelect,
  active,
}: {
  collection: Collection;
  onSelect: (slugs: string[]) => void;
  active: boolean;
}) {
  const Icon = ICON_MAP[collection.icon] || Rocket;

  return (
    <button
      onClick={() => onSelect(active ? [] : collection.skillSlugs)}
      className={`surface surface-hover flex shrink-0 items-center gap-3 px-4 py-3 text-left sm:px-5 sm:py-4 ${
        active ? "ring-1 ring-foreground/15" : ""
      }`}
      type="button"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--brand-border)] ${
          active ? "bg-primary text-primary-foreground" : "bg-white/60 text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {collection.name}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
          {collection.skills.length} skills
        </p>
      </div>
    </button>
  );
}
