import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parse-frontmatter";

export interface KnowledgeBase {
  slug: string;
  kbMd: string;
  meta: {
    name: string;
    description: string;
    category: string;
    topic: string;
    author: string;
    version: string;
    tags: string[];
  };
  body: string;
}

const KB_DIR = path.join(process.cwd(), "src/data/knowledge-bases");

function buildKB(slug: string, kbMd: string, meta: Record<string, unknown>, body: string): KnowledgeBase {
  return {
    slug,
    kbMd,
    meta: {
      name: (meta.name as string) || slug,
      description: (meta.description as string) || "",
      category: (meta.category as string) || "Uncategorized",
      topic: (meta.topic as string) || "",
      author: (meta.author as string) || "",
      version: (meta.version as string) || "1.0.0",
      tags: (meta.tags as string[]) || [],
    },
    body,
  };
}

export function getKnowledgeBases(): KnowledgeBase[] {
  if (!fs.existsSync(KB_DIR)) return [];

  const entries = fs.readdirSync(KB_DIR, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());

  return folders
    .map((folder) => {
      const kbPath = path.join(KB_DIR, folder.name, "KB.md");
      if (!fs.existsSync(kbPath)) return null;

      const kbMd = fs.readFileSync(kbPath, "utf-8");
      const { meta, body } = parseFrontmatter(kbMd);

      return buildKB(folder.name, kbMd, meta, body);
    })
    .filter(Boolean) as KnowledgeBase[];
}

export function getKnowledgeBase(slug: string): KnowledgeBase | null {
  const kbPath = path.join(KB_DIR, slug, "KB.md");
  if (!fs.existsSync(kbPath)) return null;

  const kbMd = fs.readFileSync(kbPath, "utf-8");
  const { meta, body } = parseFrontmatter(kbMd);

  return buildKB(slug, kbMd, meta, body);
}
