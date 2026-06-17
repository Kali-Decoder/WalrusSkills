"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/get-started", label: "Get Started" },
  { href: "/browse", label: "Skills" },
  { href: "/templates", label: "Templates" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/tutorial", label: "Guide" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--brand-border)] bg-[rgb(var(--bg-mint-rgb)/0.92)] backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        <Link href="/" className="group flex min-w-0 items-center">
          <BrandLogo
            priority
            sizes="136px"
            className="h-8 max-h-8 w-auto sm:h-9 sm:max-h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "text-sm",
                  pathname === link.href
                    ? "bg-[color:var(--brand-soft)] font-semibold text-foreground"
                    : "text-muted-foreground hover:bg-[color:var(--brand-soft)]/60 hover:text-foreground"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100vw-2rem,18rem)]">
            <SheetTitle className="text-base font-bold text-foreground">
              Menu
            </SheetTitle>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "h-11 w-full justify-start",
                      pathname === link.href
                        ? "bg-[color:var(--brand-soft)] text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
