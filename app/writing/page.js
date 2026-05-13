import { Link } from "next-view-transitions"
import { getPosts } from "../../lib/content";
import Badge from "../../components/Badge";

export const metadata = {
  title: "Writing",
  description: "Evergreen notes. Updated occasionally.",
  alternates: { canonical: "/writing" },
  openGraph: {
    url: "/writing",
    title: "Writing",
    description: "Evergreen notes. Updated occasionally.",
  },
  twitter: {
    title: "Writing",
    description: "Evergreen notes. Updated occasionally.",
  },
};


export default function WritingIndex() {
  const posts = getPosts();

  return (
    <main className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Writing</h1>
        <p className="text-zinc-400">Evergreen notes. Updated occasionally.</p>
      </div>
      
      <a
          href="/rss.xml"
          className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300"
        >
          RSS
      </a>

      <div className="h-px bg-zinc-800/60" />

      <div className="grid gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/writing/${p.slug}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-medium">{p.title || p.slug}</div>
                {p.summary ? (
                  <div className="text-sm text-zinc-400">{p.summary}</div>
                ) : null}

                {(p.topics || []).length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(p.topics || []).slice(0, 4).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <Badge className="text-zinc-200 border-zinc-700 whitespace-nowrap">
                {p.evergreen ? "evergreen" : p.date}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
