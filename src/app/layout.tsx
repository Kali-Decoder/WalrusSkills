import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const pixelify = localFont({
  src: "../../public/fonts/pixelify-sans/PixelifySans-wght.ttf",
  display: "swap",
  variable: "--font-sans",
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pixelify.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
