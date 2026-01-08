import { Link } from "next-view-transitions";
import Badge from "../components/Badge";

function ButtonLink({ href, children, variant = "primary" }) {
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

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-7rem)] min-h-[calc(100svh-7rem)] flex items-center">
      <section className="relative w-full py-10">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-200">
              404
            </Badge>
            <p className="text-xs tracking-widest uppercase text-zinc-400">
              Brian Hartnett • not found
            </p>
          </div>

          <h1 className="text-4xl sm:text-7xl font-semibold leading-[1.02] tracking-tight [text-shadow:0_18px_55px_rgba(0,0,0,0.75)]">
            This page doesn’t exist —
            <span className="text-zinc-400"> or it’s hiding on purpose.</span>
          </h1>

          <p className="text-zinc-400 leading-7 max-w-2xl [text-shadow:0_12px_35px_rgba(0,0,0,0.7)]">
            The URL might be wrong, the page might be unlisted, or you just
            discovered a hole in spacetime. Either way: here are sane exits.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="/" variant="primary">
              Back home
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              View work
            </ButtonLink>
            <ButtonLink href="/writing" variant="secondary">
              Read notes
            </ButtonLink>
          </div>

          <div className="pt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
