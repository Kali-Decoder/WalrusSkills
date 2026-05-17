export const KB_CATEGORIES = [
  "All",
  "Blockchain Fundamentals",
  "Smart Contracts",
  "Wallet & Frontend",
  "Deployment & Infra",
] as const;

export type KBCategory = (typeof KB_CATEGORIES)[number];
