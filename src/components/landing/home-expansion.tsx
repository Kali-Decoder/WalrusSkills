 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const USE_CASES = [
  {
    title: "dApp teams",
    desc: "Launch faster with reusable app architecture, wallet flows, and deployment-ready patterns.",
  },
  {
    title: "AI builders",
    desc: "Use production prompts, API adapters, and SDK examples to ship AI features on-chain.",
  },
  {
    title: "Infra engineers",
    desc: "Get battle-tested modules for storage, indexing, and automation around Walrus and Sui.",
  },
];

const JOURNEY = [
  {
    step: "01",
    title: "Browse by goal",
    desc: "Start from categories like onboarding, payments, storage, AI, and developer tooling.",
  },
  {
    step: "02",
    title: "Pick a starter",
    desc: "Choose skills, templates, and docs that match your stack and project stage.",
  },
  {
    step: "03",
    title: "Integrate quickly",
    desc: "Copy snippets, clone templates, and use SDK references with minimal setup.",
  },
  {
    step: "04",
    title: "Ship with confidence",
    desc: "Use proven patterns, track learning, and iterate without reinventing boilerplate.",
  },
];

const FAQS = [
  {
    q: "Is this only for experienced blockchain developers?",
    a: "No. The content is structured for both new and advanced builders, from first integration to production workflows.",
  },
  {
    q: "Can I contribute my own skills or templates?",
    a: "Yes. The platform is designed for community-driven sharing so teams can publish reusable development assets.",
  },
  {
    q: "How quickly can I go from idea to working prototype?",
    a: "Most users can start from a template and integrate core pieces in under an hour, depending on project complexity.",
  },
  {
    q: "Do I need to use all resources at once?",
    a: "Not at all. You can start with one skill or template and gradually add workflows, guides, and integrations as your app evolves.",
  },
  {
    q: "Are the templates production-ready?",
    a: "Templates are designed as solid starting points with practical patterns. You should still review, test, and adapt them for your own production requirements.",
  },
  {
    q: "Can I use Walrus Skills with my existing codebase?",
    a: "Yes. Most resources are modular, so you can integrate specific pieces into an existing repository without rebuilding everything from scratch.",
  },
  {
    q: "What if I am not building on Sui yet?",
    a: "You can still use many architecture patterns and workflows. But the biggest value comes when your app leverages Walrus + Sui integrations directly.",
  },
  {
    q: "How do I choose the right skill or template first?",
    a: "Start with your immediate product goal, then filter by category and difficulty. Pick the smallest useful starter and iterate from there.",
  },
  {
    q: "Is there guidance for security and best practices?",
    a: "Yes. Knowledge resources include implementation guidance, common pitfalls, and recommendations to help you harden your app before launch.",
  },
  {
    q: "Can teams collaborate using these resources?",
    a: "Absolutely. Teams can standardize on shared templates and workflows so onboarding is faster and implementation quality stays consistent.",
  },
];

const BUILD_WORKFLOW = [
  {
    step: "01",
    title: "Define your app goal",
    desc: "Start with a use case like NFT storage, AI metadata, content delivery, or dApp backend workflows.",
  },
  {
    step: "02",
    title: "Pick matching Walrus Skills",
    desc: "Use curated skills for setup, API integration, wallet flow, and deployment best practices.",
  },
  {
    step: "03",
    title: "Compose with templates",
    desc: "Combine starter templates and snippets to scaffold your project with less boilerplate.",
  },
  {
    step: "04",
    title: "Integrate and customize",
    desc: "Plug modules into your stack, adjust business logic, and fine-tune UX for your product.",
  },
  {
    step: "05",
    title: "Test and secure",
    desc: "Use knowledge-base guides to validate edge cases, harden integrations, and prepare for production.",
  },
  {
    step: "06",
    title: "Ship and iterate",
    desc: "Launch faster, collect feedback, and continuously improve with reusable resources.",
  },
];

interface HomeExpansionProps {
  stats: {
    skills: number;
    templates: number;
    knowledge: number;
  };
}

function CountUp({
  value,
  durationMs = 1200,
}: {
  value: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return <>{display.toLocaleString()}</>;
}

export function HomeExpansion({ stats }: HomeExpansionProps) {
  const statItems = [
    { label: "Skills & Workflows", value: stats.skills },
    { label: "Templates", value: stats.templates },
    { label: "Knowledge Articles", value: stats.knowledge },
    { label: "Total Resources", value: stats.skills + stats.templates + stats.knowledge },
  ];

  return (
    <>
      <section className="border-y border-[color:var(--brand-border)] bg-[color:var(--brand-wash)] py-8 sm:py-10">
        <Container>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
              <div key={item.label} className="surface p-4 text-center">
                <p className="text-xl font-bold text-foreground sm:text-2xl">
                  <CountUp value={item.value} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--background)] py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
              Built for every builder journey
            </h2>
            <p className="mt-3 text-pretty text-sm leading-[1.7] text-muted-foreground sm:text-base">
              Whether you are prototyping a new dApp, scaling AI features, or hardening infra,
              Walrus Skills gives you reusable foundations.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
            {USE_CASES.map((item) => (
              <article key={item.title} className="surface surface-hover p-5">
                <span className="chip">{item.title}</span>
                <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--brand-border)] bg-[color:var(--brand-wash)] py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
              From discovery to production
            </h2>
            <p className="mt-3 text-sm leading-[1.7] text-muted-foreground sm:text-base">
              A simple path that helps teams move from reading to shipping.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2">
            {JOURNEY.map((item) => (
              <div key={item.step} className="surface p-5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  STEP {item.step}
                </p>
                <h3 className="mt-2 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--background)] py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
              How to build an app with Walrus Skills
            </h2>
            <p className="mt-3 text-sm leading-[1.7] text-muted-foreground sm:text-base">
              A practical workflow from idea to launch, powered by reusable skills,
              templates, and knowledge resources.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
            {BUILD_WORKFLOW.map((item, index) => (
              <article
                key={item.step}
                className="surface text-animate-in p-5"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  WORKFLOW {item.step}
                </p>
                <h3 className="mt-2 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="safe-bottom bg-[color:var(--background)] py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-sm leading-[1.7] text-muted-foreground sm:text-base">
                Quick answers for teams evaluating Walrus Skills.
              </p>
            </div>

            <div className="mt-8 space-y-3 sm:mt-10">
              {FAQS.map((item) => (
                <details key={item.q} className="surface group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left marker:content-none">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">{item.q}</h3>
                    <span className="text-lg leading-none text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="surface mt-8 p-6 text-center sm:mt-10">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Ready to build with less friction?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.7] text-muted-foreground sm:text-base">
                Explore production-ready resources and start integrating immediately.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild className="rounded-full">
                  <Link href="/browse">Browse all skills</Link>
                </Button>
                <Button asChild variant="secondary" className="rounded-full">
                  <Link href="/templates">View templates</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
