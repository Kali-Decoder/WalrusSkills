import { HeroSection } from "@/components/landing/hero-section";
import { ValueProps } from "@/components/landing/value-props";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="border-b border-[color:var(--brand-border)] bg-[color:var(--brand-wash)]">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <div className="overflow-hidden bg-[color:var(--brand-wash)]">
            <div className="relative aspect-[16/9] w-full">
            <Image
              src="/landing.png"
              alt="Walrus Skills banner"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              className="object-contain"
            />
            </div>
          </div>
        </div>
      </section>
      <HeroSection />
      <ValueProps />
    </>
  );
}
