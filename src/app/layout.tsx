import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merchants AI — Procurement Desk",
  description:
    "AI-assisted special order procurement for Merchants Paper Company. The friendly supply house. Since 1941.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--brand-ink)] text-[var(--foreground)]">
        <TopBar />
        <main className="flex-1 brand-grid-bg">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-line)] bg-[var(--brand-ink)]/95 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-lg bg-[var(--brand-orange)] flex items-center justify-center font-bold text-[var(--brand-ink)] text-lg shadow-[0_0_0_1px_rgba(0,0,0,0.4)_inset]">
            M
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-white text-[15px]">
              merchants<span className="text-[var(--brand-orange)]">.ca</span>
              <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-[var(--brand-muted)]">
                AI Procurement Desk
              </span>
            </div>
            <div className="text-[11px] text-[var(--brand-muted)]">
              the friendly supply house. since 1941.
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/pipeline">All deals</NavLink>
          <NavLink href="/operator">Team queue</NavLink>
          <NavLink href="/about">How it works</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)]">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] pulse-orange" />
            <span className="text-[11px] text-[var(--brand-muted)] uppercase tracking-wider">AI Agent Online</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-600)] flex items-center justify-center font-semibold text-[var(--brand-ink)] text-sm">
            CA
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-[var(--brand-muted)] hover:text-white hover:bg-[var(--brand-charcoal-2)] transition-colors"
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--brand-line)] bg-[var(--brand-ink)]">
      <div className="mx-auto max-w-[1400px] px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--brand-muted)]">
        <div>
          Merchants Paper Company Limited &middot; 975 Crawford Ave, Windsor ON &middot; Prototype
        </div>
        <div className="flex items-center gap-4">
          <span>Work Instruction MWI-0703-02 &middot; AI-augmented</span>
          <span className="px-2 py-0.5 rounded bg-[var(--brand-charcoal-2)] border border-[var(--brand-line)] text-[10px] uppercase tracking-wider">
            Human-in-loop
          </span>
        </div>
      </div>
    </footer>
  );
}
