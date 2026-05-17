import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

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
    <section className="relative flex min-h-[calc(100dvh-7.5rem)] items-center justify-center overflow-hidden bg-[color:var(--brand-wash)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="bg-grid-dots bg-grid-fade absolute inset-0" />
      </div>

      <Container className="relative py-12 text-center sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="chip">
            <Image src="/logo.svg" alt="WalSkills" width={16} height={16} />
            Walrus Skills Marketplace
          </div>

        <h1 className="mt-5 text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-foreground sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem]">
          Build Faster on{" "}
          <span className="text-teal">Walrus</span>. <br/>
          Powered by <span className="text-foreground/90">Sui</span>.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-[0.95rem] leading-[1.7] text-muted-foreground sm:mt-6 sm:text-base">
          Walrus Skills is a decentralized skills marketplace and developer hub
          designed to help builders quickly create products on top of Walrus and
          the Sui ecosystem.
        </p>

        <p className="mt-4 max-w-2xl text-pretty text-[0.95rem] leading-[1.7] text-muted-foreground sm:text-base">
          Discover, share, and integrate reusable skills, workflows, AI prompts,
          SDK examples, APIs, templates, and infrastructure modules without
          starting from scratch.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8">
          {PILLARS.map((item) => (
            <span
              key={item}
              className="chip sm:text-xs"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6 sm:mt-10">
          <Button asChild className="h-11 rounded-full px-8 sm:h-12 sm:px-10">
            <Link href="/get-started">Get Started</Link>
          </Button>
          <Link
            href="/browse"
            className="text-[0.85rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse Skills
          </Link>
        </div>

        <div className="mt-14 flex w-full max-w-sm items-start justify-center sm:mt-16 sm:max-w-md">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-start">
              <div className="flex w-20 flex-col items-center text-center sm:w-28">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-xs font-bold text-foreground sm:h-9 sm:w-9">
                  {i + 1}
                </div>
                <p className="mt-2.5 text-[11px] font-semibold text-foreground/80 sm:text-xs">
                  {step.label}
                </p>
                <p className="mt-0.5 hidden text-[10px] leading-snug text-muted-foreground sm:block sm:text-[11px]">
                  {step.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mt-4 w-8 flex-shrink-0 border-t border-dashed border-[color:var(--brand-border)] sm:w-12" />
              )}
            </div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}
