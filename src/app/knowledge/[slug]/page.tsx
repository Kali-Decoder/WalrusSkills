import { getKnowledgeBase, getKnowledgeBases } from "@/lib/knowledge-bases";
import { notFound } from "next/navigation";
import { KBDetailContent } from "@/components/knowledge/kb-detail-content";

export async function generateStaticParams() {
  const kbs = getKnowledgeBases();
  return kbs.map((kb) => ({ slug: kb.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kb = getKnowledgeBase(slug);
  if (!kb) return {};
  return {
    title: `${kb.meta.name} | WalSkills Knowledge Base`,
    description: kb.meta.description,
  };
}

export default async function KBDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kb = getKnowledgeBase(slug);
  if (!kb) notFound();
  return <KBDetailContent kb={kb} />;
}
