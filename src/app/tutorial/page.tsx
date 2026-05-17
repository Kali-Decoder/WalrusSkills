"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { Container } from "@/components/layout/container";

const SECTIONS = [
  { id: "structure", label: "Structure" },
  { id: "skill-md", label: "SKILL.md" },
  { id: "readme-md", label: "README.md" },
  { id: "tips", label: "Tips" },
];

export default function TutorialPage() {
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState("structure");

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 300);

      // If scrolled to bottom, activate last section
      const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;
      if (atBottom) {
        setActive(SECTIONS[SECTIONS.length - 1].id);
        return;
      }

      for (const s of [...SECTIONS].reverse()) {
        const target = document.getElementById(s.id);
        if (target && target.getBoundingClientRect().top <= 140) {
          setActive(s.id);
          break;
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div className="sticky top-14 z-20 border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <Container className="flex items-center py-2">
          <Link
            href="/browse"
            className="mr-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex gap-1 overflow-x-auto pl-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all sm:text-xs ${
                  active === s.id
                    ? "bg-[color:var(--brand-soft)] text-foreground"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </Container>
      </div>

      <Container>
        <div className="mx-auto max-w-3xl">
          <article className="py-8 sm:py-12">
          <h1 className="text-xl font-bold tracking-[-0.02em] text-gray-900 sm:text-2xl">
            Skill Folder Guide
          </h1>

          <p className="mt-3 text-sm leading-[1.7] text-gray-500 sm:text-[0.9rem]">
            Each skill is a <strong className="text-gray-800">folder</strong> with{" "}
            <Code>SKILL.md</Code> and <Code>README.md</Code>.
            Compatible with Claude Code, Codex, and other agent platforms.
          </p>

          <div className="mt-6 h-px bg-gray-100 sm:mt-8" />

          {/* Step 1 */}
          <section id="structure" className="scroll-mt-28 mt-6 sm:mt-8">
            <StepHeader num={1} title="Folder structure" />
            <div className="pl-[34px]">
              <p className="mt-2 text-sm text-gray-500 sm:text-[0.9rem]">
                Create a folder for your skill inside your project&apos;s skills directory.
              </p>
              <CodeBlock>{`your-project/
└── skills/
    └── solidity-developer/
        ├── SKILL.md      # Required — metadata + agent instructions
        └── README.md     # Human-readable description`}</CodeBlock>
            </div>
          </section>

          {/* Step 2 */}
          <section id="skill-md" className="scroll-mt-28 mt-8 sm:mt-10">
            <StepHeader num={2} title="Create SKILL.md" />
            <div className="pl-[34px]">
              <p className="mt-2 text-sm text-gray-500 sm:text-[0.9rem]">
                Two parts: YAML frontmatter (metadata) and a markdown body (agent instructions).
              </p>

              <h3 className="mt-5 text-sm font-semibold text-gray-700 sm:text-[0.9rem]">Frontmatter</h3>
              <p className="mt-1 text-sm text-gray-400">
                <Code>name</Code> (lowercase, hyphens) and <Code>description</Code> (max 1024 chars) are required.
              </p>
              <CodeBlock>{`---
name: solidity-developer
description: Skill for agents building smart contracts on EVM-compatible chains.
skills:
  - Solidity
  - Smart Contracts
  - Foundry
  - Hardhat
  - OpenZeppelin
  - EVM
---`}</CodeBlock>

              <h3 className="mt-5 text-sm font-semibold text-gray-700 sm:text-[0.9rem]">Body</h3>
              <p className="mt-1 text-sm text-gray-400">
                Instructions the agent should follow. Include when to use and when not to.
              </p>
              <CodeBlock>{`## Instructions

You are a Solidity smart contract developer agent specializing
in EVM-compatible chains.

### Core Capabilities

- **Smart contract development** — Solidity 0.8+, ERC standards
- **Testing & tooling** — Foundry, Hardhat, fuzz/invariant testing
- **Security** — Reentrancy, access control, OpenZeppelin, Slither
- **Gas optimization** — Storage packing, Yul, batch operations

### When to Use

Writing, auditing, testing, or deploying Solidity contracts.

### When NOT to Use

Frontend, backend APIs, or non-contract work.`}</CodeBlock>
            </div>
          </section>

          {/* Step 3 */}
          <section id="readme-md" className="scroll-mt-28 mt-8 sm:mt-10">
            <StepHeader num={3} title="Create README.md" />
            <div className="pl-[34px]">
              <p className="mt-2 text-sm text-gray-500 sm:text-[0.9rem]">
                Human-readable description of the skill.
              </p>
              <CodeBlock>{`# Solidity Developer

Skill template for smart contract development on EVM chains.

## What This Skill Does

Equips your agent with Solidity expertise — writing,
testing, gas optimization, and security auditing.

## Skills Covered

- Solidity 0.8+, ERC-20/721/1155 token standards
- Foundry and Hardhat tooling
- Security patterns and static analysis

## Ideal For

Builders focused on the smart contract layer.

## Installation

Copy this folder into your project's skills directory.`}</CodeBlock>
            </div>
          </section>

          {/* Tips */}
          <section id="tips" className="scroll-mt-28 mt-8 sm:mt-10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                ?
              </span>
              <h2 className="text-sm font-semibold text-gray-800 sm:text-[0.9rem]">Tips</h2>
            </div>
            <ul className="mt-4 space-y-2.5 pl-[34px] text-sm text-gray-500 sm:text-[0.9rem]">
              {[
                <>The <Code>description</Code> field determines when the agent loads your skill — make it specific.</>,
                <>Keep SKILL.md under 500 lines. Heavy docs go in <Code>references/</Code>.</>,
                <>4-8 skill tags for best discoverability.</>,
                <>Lowercase names with hyphens: <Code>solidity-developer</Code>.</>,
                <>Optional <Code>scripts/</Code> and <Code>assets/</Code> subfolders for helpers.</>,
              ].map((text, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--brand-border)]" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="h-8 sm:h-10" />
          </article>
        </div>
      </Container>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/70 text-muted-foreground shadow-lg backdrop-blur transition-all hover:text-foreground"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function StepHeader({ num, title }: { num: number; title: string }) {
  return (
    <h2 className="text-sm font-semibold text-gray-800 sm:text-[0.9rem]">
      <span className="mr-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[11px] font-bold text-foreground align-middle">
        {num}
      </span>
      {title}
    </h2>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 rounded-lg border border-gray-100 bg-gray-50/80 p-3.5 font-mono text-xs leading-[1.6] text-gray-600 overflow-x-auto sm:p-4 sm:text-[0.8rem]">
      <code>{children}</code>
    </pre>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[color:var(--brand-soft)] px-1.5 py-0.5 text-xs font-semibold text-foreground">
      {children}
    </code>
  );
}
