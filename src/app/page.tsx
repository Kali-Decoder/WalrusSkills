import { HeroSection } from "@/components/landing/hero-section";
import { HomeExpansion } from "@/components/landing/home-expansion";
import { SupportedToolsBanner } from "@/components/landing/supported-tools-banner";
import { ValueProps } from "@/components/landing/value-props";
import { Container } from "@/components/layout/container";
import { BrandBanner } from "@/components/shared/brand-logo";
import { getSkillProfiles } from "@/lib/skills";
import { getTemplateProfiles } from "@/lib/templates";
import { getKnowledgeBases } from "@/lib/knowledge-bases";

export default function Home() {
  const skillsCount = getSkillProfiles().length;
  const templatesCount = getTemplateProfiles().length;
  const knowledgeCount = getKnowledgeBases().length;

  return (
    <div className="landing-page">
      <section className="border-b border-[color:var(--brand-border)] bg-[color:var(--brand-wash)]">
        <Container className="py-4 sm:py-6">
          <BrandBanner priority className="rounded-xl sm:rounded-2xl" />
        </Container>
      </section>
      <SupportedToolsBanner />
      <HeroSection />
      <ValueProps />
      <HomeExpansion
        stats={{
          skills: skillsCount,
          templates: templatesCount,
          knowledge: knowledgeCount,
        }}
      />
    </div>
  );
}
