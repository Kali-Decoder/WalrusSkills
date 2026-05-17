"use client";

import Link from "next/link";
import Image from "next/image";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/get-started", label: "Get Started" },
  { href: "/browse", label: "Skills" },
  { href: "/templates", label: "Templates.md" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/tutorial", label: "Guide" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--brand-border)] bg-[rgb(var(--bg-mint-rgb)/0.92)] backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="group flex items-center gap-1.5">
          <Image
            src="/logo.svg"
            alt="WalSkills"
            width={24}
            height={24}
            priority
          />
          <span className="text-sm font-bold text-foreground transition-colors group-hover:text-foreground">
            WalSkills
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "text-sm",
                  pathname === link.href
                    ? "bg-[color:var(--brand-soft)] text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-[color:var(--brand-soft)]/60"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="sm:hidden">
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="text-muted-foreground">
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
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
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
                      "w-full justify-start",
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
