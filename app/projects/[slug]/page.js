import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "../../../lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "../../../components/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import Badge from "../../../components/Badge";
import HeroImage from "../../../components/HeroImage";

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  const { content } = await compileMDX({
    source: project.body,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-[98ch] space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.status ? (
              <Badge className="text-zinc-200 border-zinc-700">
                {project.status}
              </Badge>
            ) : null}

            {(project.tags || []).slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {project.title || project.slug}
          </h1>

          {project.summary ? (
            <p className="text-zinc-400 leading-7">{project.summary}</p>
          ) : null}
        </header>

          {project.hero?.image ? (
            <HeroImage hero={project.hero} title={project.title || project.slug} />
          ) : null}

        <div className="h-px bg-zinc-800/60" />

        <article className="mdx rounded-2xl border border-zinc-800 bg-zinc-950/30 p-7 sm:p-8">
          {content}
        </article>
      </div>
    </main>
  );
}
