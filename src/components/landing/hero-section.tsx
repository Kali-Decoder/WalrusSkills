import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/shared/brand-logo";

const STEPS = [
  { label: "Discover", desc: "Find skills and templates" },
  { label: "Integrate", desc: "Drop into your repo" },
  { label: "Ship", desc: "Build on Sui with Walrus" },
];

const PILLARS = [
  "Reusable skills & workflows",
  "Templates & infra modules",
  "AI prompts, SDKs, APIs",
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-var(--header-height))] items-center justify-center overflow-hidden bg-[color:var(--brand-wash)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="bg-grid-dots bg-grid-fade absolute inset-0" />
      </div>

      <Container className="relative py-10 text-center sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="chip">
            <BrandLogo sizes="72px" className="h-[18px] max-h-[18px] w-auto" />
            Walrus Skills Marketplace
          </div>

          <h1 className="text-animate-in mt-5 text-balance text-[1.75rem] font-bold leading-[1.2] text-foreground sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem]">
            Build Faster on{" "}
            <span className="text-shimmer">Walrus</span>. Powered by{" "}
            <span className="text-foreground/90">Sui</span>.
          </h1>

          <p className="text-animate-in text-animate-delay-1 mt-5 max-w-2xl text-pretty text-[0.95rem] leading-[1.7] text-muted-foreground sm:mt-6 sm:text-base">
            Walrus Skills is a decentralized skills marketplace and developer hub
            designed to help builders quickly create products on top of Walrus and
            the Sui ecosystem.
          </p>

          <p className="text-animate-in text-animate-delay-2 mt-4 max-w-2xl text-pretty text-[0.95rem] leading-[1.7] text-muted-foreground sm:text-base">
            Discover, share, and integrate reusable skills, workflows, AI prompts,
            SDK examples, APIs, templates, and infrastructure modules without
            starting from scratch.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 px-1 sm:mt-8">
            {PILLARS.map((item) => (
              <span key={item} className="chip sm:text-xs">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <Button asChild className="h-11 w-full rounded-full px-8 sm:h-12 sm:w-auto sm:px-10">
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Link
              href="/browse"
              className="text-center text-[0.85rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse Skills
            </Link>
          </div>

          <div className="mt-12 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-16 sm:max-w-2xl sm:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-xs font-bold text-foreground sm:h-9 sm:w-9">
                  {i + 1}
                </div>
                <h3 className="mt-2.5 text-[11px] font-semibold text-foreground/80 sm:text-xs">
                  {step.label}
                </h3>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
