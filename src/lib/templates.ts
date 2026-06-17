import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parse-frontmatter";

export interface TemplateProfile {
  slug: string;
  skillMd: string;
  meta: {
    name: string;
    displayName: string;
    description: string;
    category: string;
    difficulty: string;
    skills: string[];
  };
  files: string[];
  body: string;
}

const TEMPLATES_DIR = path.join(process.cwd(), "src/data/templates");

function extractSection(body: string, heading: string): string | null {
  const pattern = new RegExp(`# ${heading}\\s*\\n([\\s\\S]*?)(?=\\n# |$)`);
  return body.match(pattern)?.[1]?.trim() ?? null;
}

function formatDisplayName(slug: string, name?: string): string {
  const raw = name?.trim() || slug;
  return raw
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferCategory(slug: string, meta: Record<string, unknown>): string {
  if (typeof meta.category === "string" && meta.category.trim()) {
    return meta.category;
  }

  const slugLower = slug.toLowerCase();
  if (slugLower.includes("move")) return "Move";
  if (slugLower.includes("python")) return "Python";
  if (slugLower.includes("javascript") || slugLower.includes("typescript")) {
    return "JavaScript / TypeScript";
  }
  return "Walrus Template";
}

function looksLikeFilePath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes(" ") || trimmed.includes("://")) return false;
  if (trimmed.startsWith("http")) return false;
  if (/\.[a-z0-9]{1,6}$/i.test(trimmed)) return true;
  return trimmed.includes("/") && !trimmed.startsWith("/v1/");
}

function inferSkillsFromBody(body: string): string[] {
  const stackSection = extractSection(body, "Stack");
  if (stackSection) {
    const fromBullets = stackSection
      .split("\n")
      .map((line) => line.match(/^-\s+(.+)$/)?.[1]?.trim())
      .filter((line): line is string => Boolean(line));
    if (fromBullets.length > 0) return fromBullets.slice(0, 8);
  }

  const hints = [
    "React",
    "TypeScript",
    "JavaScript",
    "Move",
    "Python",
    "Vite",
    "TailwindCSS",
    "Walrus",
    "Sui",
    "Solidity",
  ];
  return hints.filter((hint) => body.toLowerCase().includes(hint.toLowerCase())).slice(0, 6);
}

function inferFilesFromBody(body: string): string[] {
  const files = new Set<string>(["SKILL.md"]);
  const repoMap = extractSection(body, "Repo Map");

  const sources = repoMap ? [repoMap] : [body];
  for (const source of sources) {
    for (const match of source.matchAll(/`([^`]+)`/g)) {
      const candidate = match[1].trim();
      if (looksLikeFilePath(candidate)) files.add(candidate);
    }
  }

  return Array.from(files).slice(0, 6);
}

function inferTemplateMeta(slug: string, meta: Record<string, unknown>, body: string) {
  const skills = Array.isArray(meta.skills) ? (meta.skills as string[]) : [];
  const name = (meta.name as string) || slug;

  return {
    name,
    displayName: formatDisplayName(slug, name),
    description: (meta.description as string) || "",
    category: inferCategory(slug, meta),
    difficulty: (meta.difficulty as string) || "intermediate",
    skills: skills.length > 0 ? skills : inferSkillsFromBody(body),
  };
}

function readTemplateSkillMd(dirName: string): string | null {
  const candidates = ["SKILL.md", "Skill.md", "skill.md"];
  for (const fileName of candidates) {
    const skillPath = path.join(TEMPLATES_DIR, dirName, fileName);
    if (fs.existsSync(skillPath)) {
      return fs.readFileSync(skillPath, "utf-8");
    }
  }
  return null;
}

export function getTemplateProfiles(): TemplateProfile[] {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];

  const entries = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());

  return folders
    .map((folder) => {
      const skillMd = readTemplateSkillMd(folder.name);
      if (!skillMd) return null;

      const { meta, body } = parseFrontmatter(skillMd);
      const inferred = inferTemplateMeta(folder.name, meta, body);

      return {
        slug: folder.name,
        skillMd,
        body,
        files: inferFilesFromBody(body),
        meta: inferred,
      } satisfies TemplateProfile;
    })
    .filter(Boolean) as TemplateProfile[];
}

export function getTemplateProfile(slug: string): TemplateProfile | null {
  const skillMd = readTemplateSkillMd(slug);
  if (!skillMd) return null;

  const { meta, body } = parseFrontmatter(skillMd);

  return {
    slug,
    skillMd,
    body,
    files: inferFilesFromBody(body),
    meta: inferTemplateMeta(slug, meta, body),
  };
}
