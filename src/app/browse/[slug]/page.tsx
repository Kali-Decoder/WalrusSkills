import { getSkillProfile, getSkillProfiles } from "@/lib/skills";
import { notFound } from "next/navigation";
import { SkillDetailContent } from "@/components/skills/skill-detail-content";

export async function generateStaticParams() {
  const profiles = getSkillProfiles();
  return profiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getSkillProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.meta.name} | WalSkills`,
    description: profile.meta.description,
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getSkillProfile(slug);
  if (!profile) notFound();
  return <SkillDetailContent profile={profile} />;
}
