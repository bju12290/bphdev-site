export const runtime = "nodejs";

import { getPosts } from "../../lib/content";
import { getSiteUrl } from "../../lib/site-url"

function escapeXml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRfc822(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export function GET() {
  const site = getSiteUrl();

  const posts = getPosts()
    .filter((p) => (p.visibility || "public") === "public")
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const lastBuildDate = posts[0]?.date ? toRfc822(posts[0].date) : new Date().toUTCString();

  const itemsXml = posts
    .map((post) => {
      const url = `${site}/writing/${post.slug}`;
      return `
<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  <pubDate>${escapeXml(toRfc822(post.date))}</pubDate>
  <description>${escapeXml(post.summary || "")}</description>
</item>`.trim();
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml("Brian Hartnett — Writing")}</title>
  <link>${escapeXml(`${site}/writing`)}</link>
  <description>${escapeXml("Evergreen notes and write-ups by Brian Hartnett.")}</description>
  <language>en-us</language>
  <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
  <atom:link href="${escapeXml(`${site}/rss.xml`)}" rel="self" type="application/rss+xml" />
  ${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
