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
    <section className="bg-[color:var(--background)] py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            Your developer hub for Walrus on Sui.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-[1.7] text-muted-foreground sm:text-base">
            Browse reusable skills, workflows, AI prompts, SDK examples, APIs,
            templates, and infrastructure modules—then plug them into your
            project and ship.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[color:var(--brand-border)] bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-foreground">{c.title}</p>
              <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link href="/browse">Explore Skills</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/tutorial">Read the Guide</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
