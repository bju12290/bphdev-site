import { notFound } from "next/navigation";
import { getPosts, getPostBySlug } from "../../../lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "../../../components/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import Badge from "../../../components/Badge";
import HeroImage from "../../../components/HeroImage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = post.title || post.slug || slug;
  const description = post.summary || "Writing by Brian Hartnett.";
  const canonical = `/writing/${post.slug || slug}`;

  const visibility = post.visibility || "public";
  const shouldIndex = visibility === "public";

  const heroImage = (post.hero?.image || "").trim();
  const ogImages = heroImage
    ? [{ url: heroImage, alt: post.hero?.alt || title }]
    : [{ url: "/og.png", width: 1200, height: 630, alt: "Brian Hartnett portfolio" }];

  return {
    title,
    description,
    alternates: { canonical },
    robots: shouldIndex ? undefined : { index: false, follow: false },

    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: ogImages,
      publishedTime: post.date || undefined,
      tags: post.topics || undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage || "/og.png"],
    },
  };
}

export async function generateStaticParams() {
  return getPosts({ includeUnlisted: true }).map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const { content } = await compileMDX({
    source: post.body,
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

  const metaLabel = post.evergreen ? "evergreen" : post.date;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-[98ch] space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {metaLabel ? (
              <Badge className="text-zinc-200 border-zinc-700">
                {metaLabel}
              </Badge>
            ) : null}

            {(post.topics || []).slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {post.title || post.slug}
          </h1>

          {post.summary ? (
            <p className="text-zinc-400 leading-7">{post.summary}</p>
          ) : null}
        </header>

          {post.hero?.image ? (
            <HeroImage hero={post.hero} title={post.title || post.slug} />
          ) : null}
          
        <div className="h-px bg-zinc-800/60" />

        <article className="mdx rounded-2xl border border-zinc-800 bg-zinc-950/30 p-7 sm:p-8">
          {content}
        </article>
      </div>
    </main>
  );
}
