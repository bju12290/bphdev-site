import "./globals.css";

import FluidBackdrop from "../components/FluidBackdrop";
import ScrollProgress from "../components/ScrollProgress";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Link } from "next-view-transitions"
import { Inter, JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions"
import { getSiteUrl } from "../lib/site-url"
import { getRootJsonLd } from "../lib/structured-data";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),

  title: {
    default: "Brian Hartnett — Automation-first engineering",
    template: "%s — Brian Hartnett",
  },

  description:
    "Automation-first tooling for real workflows: integrations, Electron UI, and reliability-focused engineering.",

  openGraph: {
    type: "website",
    siteName: "Brian Hartnett",
    title: "Brian Hartnett — Automation-first engineering",
    description:
      "Automation-first tooling for real workflows: integrations, Electron UI, and reliability-focused engineering.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Brian Hartnett portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Brian Hartnett — Automation-first engineering",
    description:
      "Automation-first tooling for real workflows: integrations, Electron UI, and reliability-focused engineering.",
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};


// Toggle this for a color-cycling RGB glow in the hero backdrop.
const ENABLE_RGB_GLOW = false;
// Makes the blobs themselves hue-shift too
const ENABLE_RGB_BLOBS = true;

const FOOTER = {
  email: "hello@bphdev.com",
  github: "https://github.com/bju12290",
  linkedin: "https://www.linkedin.com/in/brian-hartnett-jr/",
  rss: "/rss.xml",
};

export default function RootLayout({ children }) {
  const jsonLd = getRootJsonLd();

  return (
    <ViewTransitions>
        <html lang="en" className={`${sans.variable} ${mono.variable}`}>
        <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Analytics/>
          <SpeedInsights/>
            <ScrollProgress />
            <FluidBackdrop rgbTopGlow={ENABLE_RGB_GLOW} rgbBlobs={ENABLE_RGB_BLOBS} />

            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            <div className="relative z-10 mx-auto max-w-5xl px-6">
            <header className="py-10 flex items-center justify-between">
                <Link
                href="/"
                className="text-sm tracking-widest uppercase text-zinc-400 hover:text-zinc-200"
                >
                Brian · Portfolio
                </Link>
                <nav className="flex gap-6 text-sm text-zinc-400">
                <Link className="hover:text-zinc-200" href="/projects">
                    Work
                </Link>
                <Link className="hover:text-zinc-200" href="/writing">
                    Writing
                </Link>
                <Link className="hover:text-zinc-200" href="/#contact">
                  Contact
                </Link>
                </nav>
            </header>

            <div className="vt-main">  
                {children}
            </div>  

            <footer className="py-14 text-xs text-zinc-500">
  
  <div className="h-px mb-8 bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />

  <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>© {new Date().getFullYear()} Brian Hartnett</span>
      <span className="text-zinc-700">—</span>
      <span className="text-zinc-600">bphdev.com</span>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${FOOTER.email}`}
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/35 px-3 py-1 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        {FOOTER.email}
      </a>

      <a
        href={FOOTER.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/35 px-3 py-1 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        GitHub
      </a>

      <a
        href={FOOTER.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/35 px-3 py-1 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        LinkedIn
      </a>

      <Link
        href={FOOTER.rss}
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/35 px-3 py-1 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        RSS
      </Link>

      <Link
        href="/#contact"
        className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/35 px-3 py-1 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        Contact
      </Link>
    </div>
  </div>
</footer>

            </div>
        </body>
        </html>
    </ViewTransitions>
  );
}
