import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parse-frontmatter";

export interface SkillProfile {
  slug: string;
  skillMd: string;
  readmeMd: string;
  meta: {
    name: string;
    description: string;
    skills: string[];
    category: string;
    difficulty: string;
    author: string;
    version: string;
    allowedTools: string[];
  };
  body: string;
}

const SKILLS_DIR = path.join(process.cwd(), "src/data/skills");

function readSkillMd(dirName: string): string | null {
  const candidates = ["SKILL.md", "Skill.md", "skill.md"];
  for (const fileName of candidates) {
    const skillPath = path.join(SKILLS_DIR, dirName, fileName);
    if (fs.existsSync(skillPath)) {
      return fs.readFileSync(skillPath, "utf-8");
    }
  }
  return null;
}

function buildProfile(slug: string, skillMd: string, readmeMd: string, meta: Record<string, unknown>, body: string): SkillProfile {
  return {
    slug,
    skillMd,
    readmeMd,
    meta: {
      name: (meta.name as string) || slug,
      description: (meta.description as string) || "",
      skills: (meta.skills as string[]) || [],
      category: (meta.category as string) || "Uncategorized",
      difficulty: (meta.difficulty as string) || "intermediate",
      author: (meta.author as string) || "",
      version: (meta.version as string) || "1.0.0",
      allowedTools: (meta["allowed-tools"] as string[]) || [],
    },
    body,
  };
}

export function getSkillProfiles(): SkillProfile[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());

  return folders
    .map((folder) => {
      const skillMd = readSkillMd(folder.name);
      const readmePath = path.join(SKILLS_DIR, folder.name, "README.md");

      if (!skillMd) return null;

      const readmeMd = fs.existsSync(readmePath)
        ? fs.readFileSync(readmePath, "utf-8")
        : "";
      const { meta, body } = parseFrontmatter(skillMd);

      return buildProfile(folder.name, skillMd, readmeMd, meta, body);
    })
    .filter(Boolean) as SkillProfile[];
}

export function getSkillProfile(slug: string): SkillProfile | null {
  const skillMd = readSkillMd(slug);
  if (!skillMd) return null;

  const readmePath = path.join(SKILLS_DIR, slug, "README.md");
  const readmeMd = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf-8")
    : "";
  const { meta, body } = parseFrontmatter(skillMd);

  return buildProfile(slug, skillMd, readmeMd, meta, body);
}
