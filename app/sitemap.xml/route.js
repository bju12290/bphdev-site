export const runtime = "nodejs";

import { getProjects, getPosts } from "../../lib/content";

function escapeXml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  // Static routes you always want indexed
  const staticRoutes = [
    { path: "/", priority: "1.0" },
    { path: "/projects", priority: "0.8" },
    { path: "/writing", priority: "0.8" },
  ];

  // Content routes: ONLY public
  const projects = getProjects()
    .filter((p) => (p.visibility || "public") === "public")
    .map((p) => ({
      path: `/projects/${p.slug}`,
      lastmod: p.date || null,
      priority: "0.7",
    }));

  const posts = getPosts()
    .filter((p) => (p.visibility || "public") === "public")
    .map((p) => ({
      path: `/writing/${p.slug}`,
      lastmod: p.date || null,
      priority: "0.6",
    }));

  const urls = [...staticRoutes, ...projects, ...posts];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map((u) => {
        const loc = `${site}${u.path}`;
        const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
        const priority = u.priority ? `<priority>${escapeXml(u.priority)}</priority>` : "";
        return `<url><loc>${escapeXml(loc)}</loc>${lastmod}${priority}</url>`;
      })
      .join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
