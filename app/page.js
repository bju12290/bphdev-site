import { Link } from "next-view-transitions"
import Badge from "../components/Badge";
import { getProjects, getPosts } from "../lib/content";

const CONTACT = {
  email: "hello@bphdev.com",         
  github: "https://github.com/bju12290",
  linkedin: "https://www.linkedin.com/in/brian-hartnett-jr/",
};

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

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

function SlimRow({ label, href, hrefLabel }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{label}</h2>
      {href ? (
        <Link href={href} className="text-sm text-zinc-400 hover:text-zinc-200">
          {hrefLabel || "View all →"}
        </Link>
      ) : null}
    </div>
  );
}

function SmallCard({ href, title, summary, chips = [], meta }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-5 hover:border-zinc-700 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-lg font-medium">{title}</div>
          {summary ? <p className="text-sm text-zinc-400">{summary}</p> : null}

          {chips.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.slice(0, 3).map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          ) : null}
        </div>

        {meta ? (
          <Badge className="text-zinc-200 border-zinc-700 whitespace-nowrap">
            {meta}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}

function FeaturedCard({ p }) {
  const tags = [
    ...(p?.status ? [p.status] : []),
    ...(p?.tags || []),
  ].filter(Boolean);

  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/45 p-7 sm:p-10 hover:border-zinc-700 transition"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(700px_circle_at_75%_60%,rgba(255,255,255,0.05),transparent_62%)]" />

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="text-zinc-200 border-zinc-700">featured</Badge>
            {tags.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              {p.title || p.slug}
            </h3>
            {p.summary ? (
              <p className="text-zinc-400 leading-7 max-w-2xl">{p.summary}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-300">
              Case study • architecture • implementation
            </span>
            <span className="text-zinc-700">•</span>
            <span className="text-sm text-zinc-400">Open →</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/70 bg-black/20 p-5 sm:p-6">
          <div className="space-y-4">
            <div className="text-sm text-zinc-200 font-medium">
              What you’ll see inside
            </div>
            <ul className="space-y-2 text-sm text-zinc-400 leading-6">
              <li>• The problem it solves</li>
              <li>• System design + tradeoffs</li>
              <li>• Reliability + safety checks</li>
              <li>• UX for real workflows</li>
            </ul>

            <div className="pt-2">
              <span className="text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition">
                Open case study →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const projects = getProjects();
  const posts = getPosts();

  const featured = projects.find((p) => p.featured) || projects[0];

  const smallProjects = projects
    .filter((p) => p.slug !== featured?.slug)
    .slice(0, 4);

  const evergreen = posts.filter((p) => p.evergreen).slice(0, 3);
  const writingPicks = evergreen.length ? evergreen : posts.slice(0, 3);

  return (
    <main className="pb-14">
      <section
            className="
                relative
                min-h-[calc(100vh-7rem)] min-h-[calc(100svh-7rem)]
                overflow-hidden
            "
        >

        <div
            className="
            min-h-[calc(100vh-7rem)] min-h-[calc(100svh-7rem)]
            flex items-center
            "
        >
          <div className="relative w-full">
            <div className="space-y-6 max-w-4xl">
              <p className="text-xs tracking-widest uppercase text-zinc-400">
                Brian Hartnett • automation / web tooling
              </p>

              <h1 className="text-4xl sm:text-7xl font-semibold leading-[1.02] tracking-tight [text-shadow:0_18px_55px_rgba(0,0,0,0.75)]">
                Systems that remove friction —
                <span className="text-zinc-400"> quietly, reliably, and fast.</span>
              </h1>

              <p className="text-zinc-400 leading-7 max-w-2xl [text-shadow:0_12px_35px_rgba(0,0,0,0.7)]">
                Automation-first tooling for real workflows: integrations,
                Electron UI, and reliability-focused engineering.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <ButtonLink href="/projects" variant="primary">
                  View work
                </ButtonLink>
                <ButtonLink href="/writing" variant="secondary">
                  Read notes
                </ButtonLink>
              </div>
            </div>

            <a
              href="#below"
              className="absolute left-0 -bottom-16 sm:-bottom-20 inline-flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-300 transition"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-5 w-5 rounded-full border border-zinc-700/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse" />
              </span>
              Scroll
            </a>
          </div>
        </div>
      </section>

      {/* BELOW THE FOLD CONTENT */}
      <section id="below" className="space-y-12 pt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />

        {featured ? (
          <div className="space-y-5">
            <SlimRow label="Featured" href="/projects" hrefLabel="All work →" />
            <FeaturedCard p={featured} />
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <SlimRow
              label="Selected projects"
              href="/projects"
              hrefLabel="Browse →"
            />
            <div className="grid gap-4">
              {smallProjects.map((p) => (
                <SmallCard
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  title={p.title || p.slug}
                  summary={p.summary}
                  chips={p.tags || []}
                  meta={p.status}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <SlimRow label="Notes" href="/writing" hrefLabel="All notes →" />
            <div className="grid gap-4">
              {writingPicks.map((post) => (
                <SmallCard
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  title={post.title || post.slug}
                  summary={post.summary}
                  chips={post.topics || []}
                  meta={post.evergreen ? "evergreen" : post.date}
                />
              ))}
            </div>

            <p className="text-sm text-zinc-500 max-w-xl">
              Notes are maintained when there’s something worth preserving.
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />

        <section id="contact" className="scroll-mt-24 space-y-6 pt-6">
          <div className="flex items-center gap-3">
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
              Contact
            </Badge>
            <p className="text-xs tracking-widest uppercase text-zinc-400">
              Brian Hartnett • get in touch
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-semibold leading-[1.06] tracking-tight [text-shadow:0_18px_55px_rgba(0,0,0,0.6)]">
                Let’s build something
                <span className="text-zinc-400"> reliable.</span>
              </h2>

              <p className="text-zinc-400 leading-7 max-w-xl [text-shadow:0_12px_35px_rgba(0,0,0,0.55)]">
                Email is the fastest path. If you include context + constraints (stack,
                timeline, what “done” looks like), I can respond with something useful
                instead of “tell me more” ping-pong.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition border border-zinc-800 bg-zinc-950/55 text-zinc-200 hover:border-zinc-700"
                >
                  Email me
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/45 p-7 sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(700px_circle_at_75%_60%,rgba(255,255,255,0.05),transparent_62%)]" />

              <div className="relative space-y-4">
                <div className="text-sm text-zinc-200 font-medium">Direct</div>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="block text-lg sm:text-xl font-medium text-zinc-100 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300"
                >
                  {CONTACT.email}
                </a>

                <div className="space-y-2 text-sm text-zinc-400 leading-6">
                  <div className="flex items-center justify-between gap-4">
                    <span>GitHub</span>
                    <a
                      href={CONTACT.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 hover:text-zinc-100"
                    >
                      bju12290 →
                    </a>
                  </div>


                  <div className="flex items-center justify-between gap-4">
                    <span>LinkedIn</span>
                    <a
                      href={CONTACT.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 hover:text-zinc-100"
                    >Open →</a>
                  </div>
                </div>

                <p className="pt-2 text-xs text-zinc-500">
                  No forms. No spam. Just email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
