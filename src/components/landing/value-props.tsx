import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const CARDS = [
  {
    title: "Discover and share",
    desc: "Explore community-made skills, workflows, prompts, and examples purpose-built for Walrus + Sui builders.",
  },
  {
    title: "Integrate in minutes",
    desc: "Copy/paste or install reusable modules—templates, SDK snippets, APIs, and infra building blocks—directly into your repo.",
  },
  {
    title: "Ship faster",
    desc: "Skip boilerplate and focus on product: start from working patterns and iterate quickly on top of Walrus and the Sui ecosystem.",
  },
];

export function ValueProps() {
  return (
    <section className="safe-bottom bg-[color:var(--background)] py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl px-1 text-center sm:px-0">
          <h2 className="text-balance text-xl font-bold text-foreground sm:text-3xl">
            Your developer hub for Walrus on Sui.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-[1.7] text-muted-foreground sm:text-base">
            Browse reusable skills, workflows, AI prompts, SDK examples, APIs,
            templates, and infrastructure modules—then plug them into your
            project and ship.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[color:var(--brand-border)] bg-white p-4 shadow-sm sm:p-5"
            >
              <h3 className="text-sm font-semibold text-foreground sm:text-base">{c.title}</h3>
              <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center">
          <Button asChild className="w-full rounded-full sm:w-auto">
            <Link href="/browse">Explore Skills</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full rounded-full sm:w-auto">
            <Link href="/tutorial">Read the Guide</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
