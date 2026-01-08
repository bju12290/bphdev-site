"use client";

import { useEffect } from "react";
import { Link } from "next-view-transitions";
import Badge from "../components/Badge";

function ButtonLink({ href, children, variant = "secondary" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition";
  const styles =
    variant === "primary"
      ? "border border-zinc-800 bg-zinc-950/55 text-zinc-200 hover:border-zinc-700"
      : "border border-zinc-800 bg-transparent text-zinc-300 hover:border-zinc-700";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-7rem)] min-h-[calc(100svh-7rem)] flex items-center">
      <section className="relative w-full py-10">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-200">
              Error
            </Badge>
            <p className="text-xs tracking-widest uppercase text-zinc-400">
              Brian Hartnett • something broke
            </p>
          </div>

          <h1 className="text-4xl sm:text-7xl font-semibold leading-[1.02] tracking-tight [text-shadow:0_18px_55px_rgba(0,0,0,0.75)]">
            The page crashed —
            <span className="text-zinc-400"> we can try again.</span>
          </h1>

          <p className="text-zinc-400 leading-7 max-w-2xl [text-shadow:0_12px_35px_rgba(0,0,0,0.7)]">
            This is a runtime error boundary. Retrying usually works if it was a
            transient hiccup. If it doesn’t, the bug is real and it’s mine.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition border border-zinc-800 bg-zinc-950/55 text-zinc-200 hover:border-zinc-700"
            >
              Try again
            </button>

            <ButtonLink href="/" variant="secondary">
              Back home
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Work
            </ButtonLink>
          </div>

          {/* Dev-only: show the actual message */}
          {process.env.NODE_ENV === "development" ? (
            <div className="pt-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-4">
                <div className="text-xs tracking-widest uppercase text-zinc-500">
                  dev details
                </div>
                <pre className="mt-2 text-xs text-zinc-300 overflow-auto">
                  {String(error?.message || error)}
                </pre>
              </div>
            </div>
          ) : null}

          <div className="pt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
