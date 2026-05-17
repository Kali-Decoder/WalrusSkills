export const CATEGORIES = [
  "All",
  "Smart Contracts",
  "Full Stack",
  "DeFi",
  "Frontend",
  "Gaming",
  "Infrastructure",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  beginner: { label: "Beginner", bg: "bg-emerald-50", text: "text-emerald-600" },
  intermediate: { label: "Intermediate", bg: "bg-[color:var(--brand-soft)]", text: "text-gray-900" },
  advanced: { label: "Advanced", bg: "bg-red-50", text: "text-red-600" },
};
