export function parseFrontmatter(content: string): {
  meta: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const rawMeta = match[1];
  const body = match[2].trim();
  const meta: Record<string, unknown> = {};

  let currentKey = "";
  let inArray = false;
  const arrayValues: string[] = [];

  for (const line of rawMeta.split("\n")) {
    if (inArray) {
      if (line.startsWith("  - ")) {
        arrayValues.push(line.replace("  - ", "").trim());
        continue;
      } else {
        meta[currentKey] = [...arrayValues];
        arrayValues.length = 0;
        inArray = false;
      }
    }

    const kvMatch = line.match(/^([\w-]+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === "") {
        currentKey = key;
        inArray = true;
      } else {
        meta[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }

  if (inArray) {
    meta[currentKey] = [...arrayValues];
  }

  return { meta, body };
}
