import { Link } from "next-view-transitions"
import { getProjects } from "../../lib/content";
import Badge from "../../components/Badge";

export default function ProjectsIndex() {
  const projects = getProjects();

  return (
    <main className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Work</h1>
        <p className="text-zinc-400">Flagship case studies + smaller builds.</p>
      </div>

      <div className="h-px bg-zinc-800/60" />

      <div className="grid gap-4">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-medium">{p.title || p.slug}</div>
                {p.summary ? (
                  <div className="text-sm text-zinc-400">{p.summary}</div>
                ) : null}

                {(p.tags || []).length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(p.tags || []).slice(0, 4).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              {p.status ? (
                <Badge className="text-zinc-200 border-zinc-700 whitespace-nowrap">
                  {p.status}
                </Badge>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
