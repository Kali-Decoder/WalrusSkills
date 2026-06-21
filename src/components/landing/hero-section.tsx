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
    <section className="relative overflow-hidden bg-[color:var(--brand-wash)] sm:flex sm:min-h-[calc(100dvh-var(--header-height))] sm:items-center sm:justify-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="bg-grid-dots bg-grid-fade absolute inset-0" />
      </div>

      <Container className="relative py-8 text-center sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="chip px-3 py-1.5 sm:px-3">
            <BrandLogo sizes="72px" className="h-4 max-h-4 w-auto sm:h-[18px] sm:max-h-[18px]" />
            <span className="text-pretty">Walrus Skills Marketplace</span>
          </div>

          <h1 className="text-animate-in mt-4 text-balance text-[1.75rem] font-bold leading-[1.15] text-foreground sm:mt-5 sm:text-[2.5rem] sm:leading-[1.2] md:text-[3rem] lg:text-[3.5rem]">
            Build Faster on{" "}
            <span className="text-shimmer text-teal-400">Walrus</span>. Powered by{" "}
            <span className="text-foreground/90 text-teal-500">Sui</span>.
          </h1>

          <p className="text-animate-in text-animate-delay-1 mt-4 max-w-2xl text-pretty px-1 text-sm leading-[1.7] text-muted-foreground sm:mt-6 sm:px-0 sm:text-base">
            Walrus Skills is a decentralized skills marketplace and developer hub
            designed to help builders quickly create products on top of Walrus and
            the Sui ecosystem.
          </p>

          <p className="text-animate-in text-animate-delay-2 mt-3 max-w-2xl text-pretty px-1 text-sm leading-[1.7] text-muted-foreground sm:mt-4 sm:px-0 sm:text-base">
            Discover, share, and integrate reusable skills, workflows, AI prompts,
            SDK examples, APIs, templates, and infrastructure modules without
            starting from scratch.
          </p>

          <div className="mt-6 flex w-full max-w-md flex-col items-stretch gap-2 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            {PILLARS.map((item) => (
              <span key={item} className="chip w-full justify-center px-3 py-2 sm:w-auto sm:py-1">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-7 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <Button asChild className="h-11 w-full rounded-full px-8 sm:h-12 sm:w-auto sm:px-10">
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Link
              href="/browse"
              className="py-1 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-[0.85rem]"
            >
              Browse Skills
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-md grid-cols-1 gap-3 sm:mt-16 sm:max-w-2xl sm:grid-cols-3 sm:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.label} className="surface flex items-center gap-3 p-3 text-left sm:flex-col sm:items-center sm:p-0 sm:text-center sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:border-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-xs font-bold text-foreground sm:h-9 sm:w-9">
                  {i + 1}
                </div>
                <div className="min-w-0 sm:mt-2.5">
                  <h3 className="text-xs font-semibold text-foreground/80 sm:text-[11px]">
                    {step.label}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-[10px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
