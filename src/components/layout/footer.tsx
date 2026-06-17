import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="safe-bottom border-t border-[color:var(--brand-border)] py-5">
      <Container className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">WalSkills</p>
        <div className="flex gap-4">
          <Link
            href="/browse"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Skills
          </Link>
          <Link
            href="/knowledge"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Knowledge
          </Link>
          <Link
            href="/tutorial"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Guide
          </Link>
        </div>
      </Container>
    </footer>
  );
}
