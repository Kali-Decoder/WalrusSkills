import {
  Bot,
  Brain,
  Code2,
  Github,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const TOOLS: Array<{ name: string; icon: LucideIcon }> = [
  { name: "ChatGPT", icon: Bot },
  { name: "Claude", icon: Brain },
  { name: "Cursor IDE", icon: Code2 },
  { name: "Gemini", icon: Sparkles },
  { name: "GitHub Copilot", icon: Github },
  { name: "OpenRouter", icon: Workflow },
];

export function SupportedToolsBanner() {
  const items = [...TOOLS, ...TOOLS];

  return (
    <section className="border-b border-[color:var(--brand-border)] bg-[color:var(--brand-wash)] py-3 sm:py-4">
      <Container>
        <div className="surface overflow-hidden rounded-xl border-[color:var(--brand-border)] px-0 py-2 sm:rounded-2xl">
          <div className="tool-marquee-track">
            {items.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div key={`${tool.name}-${index}`} className="tool-inline-item">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tool.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
