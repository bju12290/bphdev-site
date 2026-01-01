import "./globals.css";
import { Link } from "next-view-transitions"
import { Inter, JetBrains_Mono } from "next/font/google";
import FluidBackdrop from "../components/FluidBackdrop";
import ScrollProgress from "../components/ScrollProgress";
import { ViewTransitions } from "next-view-transitions"

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
  title: "Portfolio",
  description: "Portfolio and writing",
};

// Toggle this for a color-cycling RGB glow in the hero backdrop.
const ENABLE_RGB_GLOW = false;
// Makes the blobs themselves hue-shift too
const ENABLE_RGB_BLOBS = true;


export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
        <html lang="en" className={`${sans.variable} ${mono.variable}`}>
        <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
            <ScrollProgress />
            <FluidBackdrop rgbTopGlow={ENABLE_RGB_GLOW} rgbBlobs={ENABLE_RGB_BLOBS} />

            {/*
            Top scrim: keeps the navbar living in the same "atmosphere" as the hero.
            Without this, the hero has its own scrim and you get a hard edge where
            the header ends and the hero begins.
            */}
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
                </nav>
            </header>

            <div className="vt-main">  
                {children}
            </div>  

            <footer className="py-14 text-xs text-zinc-500">
                © {new Date().getFullYear()} Brian Hartnett
            </footer>
            </div>
        </body>
        </html>
    </ViewTransitions>
  );
}
