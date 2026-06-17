import { HeroSection } from "@/components/landing/hero-section";
import { ValueProps } from "@/components/landing/value-props";
import { Container } from "@/components/layout/container";
import { BrandBanner } from "@/components/shared/brand-logo";

export default function Home() {
  return (
    <div className="landing-page">
      <section className="border-b border-[color:var(--brand-border)] bg-[color:var(--brand-wash)]">
        <Container className="py-4 sm:py-6">
          <BrandBanner priority className="rounded-xl sm:rounded-2xl" />
        </Container>
      </section>
      <HeroSection />
      <ValueProps />
    </div>
  );
}
