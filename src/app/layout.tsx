import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "WalSkills — Skill Marketplace for Walrus on Sui",
  description:
    "A marketplace of skills and templates to onboard developers to Walrus on Sui, plus a verifiable data layer for high-stakes systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <TooltipProvider>
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="bg-grid bg-grid-fade absolute inset-0 opacity-30" />
            <div className="bg-grid-dots bg-grid-fade absolute inset-0 opacity-30" />
          </div>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
