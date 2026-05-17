import JSZip from "jszip";

export async function downloadSkillZip(slug: string, skillMd: string, readmeMd: string) {
  const zip = new JSZip();
  const folder = zip.folder(slug)!;
  folder.file("SKILL.md", skillMd);
  if (readmeMd) folder.file("README.md", readmeMd);
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.zip`;
  a.click();
  URL.revokeObjectURL(url);

  // Track download (fire-and-forget)
  fetch("/api/downloads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}
