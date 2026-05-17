import collectionsData from "@/data/collections.json";
import { getSkillProfiles, type SkillProfile } from "./skills";

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  skillSlugs: string[];
  skills: SkillProfile[];
}

export function getCollections(): Collection[] {
  const allProfiles = getSkillProfiles();
  return collectionsData.map((c) => ({
    ...c,
    skills: c.skillSlugs
      .map((slug) => allProfiles.find((p) => p.slug === slug))
      .filter(Boolean) as SkillProfile[],
  }));
}
